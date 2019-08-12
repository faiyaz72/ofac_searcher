'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const utils = require('./utils');

const app = express();
const port = process.env.PORT || 3000;

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'reg_compl',
    host: '192.168.11.206',
    database: 'reg_compl',
    password: 'ticktrade',
    port: 5432
})

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get('/', (req, res) => {
    res.json({info: 'Node.js'})
})

app.get('/testSdnNames', async (req, res) => {
    const results = await pool.query(`SELECT s1.ent_num, s1.sdn_name 
    FROM public.\"SDN\" s1 left join public.\"ALT\" a1 on s1.ent_num = a1.ent_num 
    limit 20;`)
    res.send(results["rows"]);
})

const getDateTime = () => {
    const today = new Date();
    return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}, ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
}

const compare = (a, b) => {
    return a.score - b.score;
  }


app.post('/verifyOfac', async (req, res) => {


    const toTest = utils.toSearch(req.body.name);
    let aggregator = { results: [] };

    // FROM, WHO, WHAT;

    const date = getDateTime();

    console.log(`Received request for String "${req.body.name}" From ${req.ip} on ${date}`);

    let search3, search4, search5, search6, search7, search8

    const search1 = await pool.query(utils.nonIndividualQuery("SDN", "ALT", toTest))
    const search2 = await pool.query(utils.nonIndividualQuery("CONS_PRIM", "CONS_ALT", toTest));

    utils.aggregateQuery(search1.rows, aggregator.results, toTest);
    utils.aggregateQuery(search2.rows, aggregator.results, toTest);

    const name = utils.extractFirstLastNames(toTest);

    if (name.length == 1) {

        search3 = await pool.query(utils.individualQuerySingle("SDN", "ALT", name[0], toTest));
        search4 = await pool.query(utils.individualQuerySingle("CONS_PRIM", "CONS_ALT", name[0], toTest));
        
    } else {

        const reversed = utils.getReverse(toTest);
        const reverseSearch = utils.reverseSearch(toTest);
        search3 = await pool.query(utils.individualQueryNonSingle("SDN", "ALT", `'${name[0]}'`, `'${name[1]}'`, reversed));
        search4 = await pool.query(utils.individualQueryNonSingle("CONS_PRIM", "CONS_ALT", `'${name[0]}'`, `'${name[1]}'`, reversed));
        search5 = await pool.query(utils.individualQueryNonSingle("SDN", "ALT", `'${reverseSearch[0]}'`, `'${reverseSearch[1]}'`, toTest));
        search6 = await pool.query(utils.individualQueryNonSingle("CONS_PRIM", "CONS_ALT", `'${reverseSearch[0]}'`, `'${reverseSearch[1]}'`, toTest));
        search7 = await pool.query(utils.individualQuerySingle("SDN", "ALT", toTest, toTest));
        search8 = await pool.query(utils.individualQuerySingle("CONS_PRIM", "CONS_ALT", toTest, toTest));

        utils.aggregateQuery(search5.rows, aggregator.results, toTest);
        utils.aggregateQuery(search6.rows, aggregator.results, toTest);
        utils.aggregateQuery(search7.rows, aggregator.results, toTest)
        utils.aggregateQuery(search8.rows, aggregator.results, toTest)

    }

    utils.aggregateQuery(search3.rows, aggregator.results, toTest);
    utils.aggregateQuery(search4.rows, aggregator.results, toTest);


    if (aggregator.results.length === 0) {
        aggregator.min_score = -1;
    } else {
        aggregator.min_score = utils.findMinimumScore(aggregator.results);
        aggregator.results.sort((a, b) => {
            return a.score - b.score;
          })
    }

    if (aggregator.min_score > 3 || aggregator.min_score === -1) {
        aggregator.ofac_passed = true;
    } else {
        aggregator.ofac_passed = false;
    }

    if (aggregator.min_score === -1) {
        aggregator.max_percentage = 0
    } else {
        aggregator.max_percentage = (100 - aggregator.min_score);
    }

    aggregator.l_score_threshold = utils.levenshteinScore(toTest);

    console.log(`Request handled for ${req.ip}`)
    res.send(aggregator);
})


app.listen(port, () => {
    console.log(`OFAC Search server start on ${getDateTime()}, port: ${port} `)
})