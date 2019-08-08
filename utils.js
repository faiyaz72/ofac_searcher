'use strict'

const levenshteinThresholdPercentage = 0.90
const schema = "ofac";


const toSearch = (toTest) => {

    const filtered = toTest.replace(/[^a-zA-Z0-9\s]+/,"");
    const lowered = filtered.trim().toLowerCase();
    return "'" + lowered + "'";
}

const nonIndividualQuery = (table1, table2, toTest) => {
    return `SELECT s1.ent_num, s1.sdn_name, a1.alt_name, LEAST(levenshtein(lower(s1.sdn_name), ${toTest}), levenshtein(lower(a1.alt_name), ${toTest})) as score 
    from ${schema}.\"${table1}\" s1 LEFT JOIN ${schema}.\"${table2}\" a1 ON s1.ent_num = a1.ent_num 
    where s1.sdn_type != 'individual' AND (dmetaphone(s1.sdn_name) = dmetaphone(${toTest}) OR dmetaphone(a1.alt_name) = dmetaphone(${toTest})) ORDER BY score;` 
}

const individualQuerySingle = (table1, table2, firstName, toTest) => {
    return `SELECT s1.ent_num, s1.sdn_name, a1.alt_name, LEAST(levenshtein(lower(s1.sdn_name), ${toTest}), levenshtein(lower(a1.alt_name), ${toTest}), levenshtein(lower(trim(from split_part(s1.sdn_name, ',', 2))), ${toTest}), 
    levenshtein(lower(trim(from split_part(s1.sdn_name, ',', 1))), ${toTest}), levenshtein(lower(trim(from split_part(a1.alt_name, ',', 1))), ${toTest}), levenshtein(lower(trim(from split_part(a1.alt_name, ',', 2))), ${toTest})) as score 
    from ${schema}.\"${table1}\" s1 LEFT JOIN ${schema}.\"${table2}\" a1 ON s1.ent_num = a1.ent_num 
    where s1.sdn_type = 'individual' AND (
        (dmetaphone(trim(from split_part(s1.sdn_name, ',', 2))) = dmetaphone(${firstName}) or dmetaphone(trim(from split_part(a1.alt_name, ',', 2))) = dmetaphone(${firstName})) 
        OR 
        (dmetaphone(trim(from split_part(s1.sdn_name, ',', 1))) = dmetaphone(${firstName}) or dmetaphone(trim(from split_part(a1.alt_name, ',', 1))) = dmetaphone(${firstName})))   
        ORDER BY score;`  
}

const individualQueryNonSingle = (table1, table2, firstName, lastName, toTest) => {
    return `SELECT s1.ent_num, s1.sdn_name, a1.alt_name, LEAST(levenshtein(lower(s1.sdn_name), ${toTest}), levenshtein(lower(a1.alt_name), ${toTest}), levenshtein(lower(trim(from split_part(s1.sdn_name, ',', 2))), ${toTest}), 
    levenshtein(lower(trim(from split_part(s1.sdn_name, ',', 1))), ${toTest}), levenshtein(lower(trim(from split_part(a1.alt_name, ',', 1))), ${toTest}), levenshtein(lower(trim(from split_part(a1.alt_name, ',', 2))), ${toTest})) as score 
    from ${schema}.\"${table1}\" s1 LEFT JOIN ${schema}.\"${table2}\" a1 ON s1.ent_num = a1.ent_num 
    where s1.sdn_type = 'individual' AND (
        (dmetaphone(trim(from split_part(s1.sdn_name, ',', 2))) = dmetaphone(${firstName}) or dmetaphone(trim(from split_part(a1.alt_name, ',', 2))) = dmetaphone(${firstName})) 
        AND 
        (dmetaphone(trim(from split_part(s1.sdn_name, ',', 1))) = dmetaphone(${lastName}) or dmetaphone(trim(from split_part(a1.alt_name, ',', 1))) = dmetaphone(${lastName})))   
        ORDER BY score;` 
}

const levenshteinScore = (toCompare) => {
    const stringLength = toCompare.length;
    return Math.ceil(levenshteinThresholdPercentage * stringLength);
}

// const sdnNameExist = (values, sdnName) => {
//     return values.indexOf(sdnName) > -1
// }

const sdnNameExist = (resultList, nameToCheck) => {
    return resultList.matched_names.indexOf(nameToCheck) > -1
}

// const addAltName = (aggregator, altName, score) => {
//     if (altName && aggregator[score].indexOf(altName) === -1) {
//         aggregator[score].push(altName);
//     }
// }

const addAltName = (resultList, altName) => {
    if (altName && resultList.matched_names.indexOf(altName) === -1) {
        resultList.matched_names.push(altName);
    }
}

const getReverse = (toTest) => {
    const stringLength = toTest.length;
    const firstName = toTest.substring(1, toTest.lastIndexOf(" "));
    const lastName = toTest.substring(toTest.lastIndexOf(" ") + 1, stringLength - 1);
    return `'${lastName} ${firstName}'`
}

const reverseSearch = (toTest) => {
    const stringLength = toTest.length;
    const lastName = toTest.substring(1, toTest.indexOf(" "));
    const firstName = toTest.substring(toTest.indexOf(" ") + 1, stringLength - 1);
    return [firstName, lastName];
}

const extractFirstLastNames = (toTest) => {
    let result = []
    if (toTest.lastIndexOf(" ") == -1) {
        result.push(toTest);
        return result;
    }

    const stringLength = toTest.length;

    const firstName = toTest.substring(1, toTest.lastIndexOf(" "));
    const lastName = toTest.substring(toTest.lastIndexOf(" ") + 1, stringLength - 1);

    result.push(firstName);
    result.push(lastName);
    return result;
}

const scoreExists = (resultList, scoreToCheck) => {

    for (let i = 0; i < resultList.length; i++) {
        if (resultList[i].score === scoreToCheck) {
            return i
        }
    }

    return -1;
}

const aggregateQuery = (queryResult, aggregator, toTest) => {

    const levenshteinThreshold = levenshteinScore(toTest);
    
    for (let i = 0; i < queryResult.length; i++) {
        const sdnName = queryResult[i].sdn_name;
        const altName = queryResult[i].alt_name
        const score = queryResult[i].score;

        if (score > levenshteinThreshold) {
            break;
        }

        // if (score in aggregator) {
        //     addAltName(aggregator, altName, score);
        //     if (!sdnNameExist(aggregator[score], sdnName)) {
        //         aggregator[score].push(sdnName);
        //     }
        // } else {
        //     let newList = [];
        //     newList.push(sdnName);
        //     aggregator[score] = newList;
        //     addAltName(aggregator, altName, score); 
        // }

        const scoreIndex = scoreExists(aggregator, score);

        if (scoreIndex > -1) {
            addAltName(aggregator[scoreIndex], altName);
            if (!sdnNameExist(aggregator[scoreIndex], sdnName)) {
                aggregator[scoreIndex].matched_names.push(sdnName);
            }
        } else {
            let newEntry = {score: score, matched_names: [sdnName]}
            const newIndex = aggregator.length;
            aggregator.push(newEntry);
            addAltName(aggregator[newIndex], altName);
        }
    }
}

const findMinimumScore = (resultList) => {
    let minimumScore = resultList[0].score;
    for (let i = 0; i < resultList.length; i++) {
        if (resultList[i].score < minimumScore) {
            minimumScore = resultList[i].score;
        }
    }
    return minimumScore;
}

module.exports = {
    toSearch,
    nonIndividualQuery,
    aggregateQuery,
    extractFirstLastNames,
    getReverse,
    individualQuerySingle,
    individualQueryNonSingle,
    reverseSearch,
    levenshteinScore,
    findMinimumScore
}