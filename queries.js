'use strict'
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Xboxlive72',
    port: 5432
})

const getSDNnames = (req, res) => {
    // pool.query('SELECT s1.ent_num, s1.sdn_name FROM public.\"SDN\" s1 left join public.\"ALT\" a1 on s1.ent_num = a1.ent_num limit 20;'), (error, result) => {
    //     console.log("reacehed")
    //     if (error) {
    //         throw error
    //     }
    //     res.status(200).send(json(result.rows))
    // }
    res.status(200).send(json(('hi')))
}

module.exports = {
    getSDNnames
}