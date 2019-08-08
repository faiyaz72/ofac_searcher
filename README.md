# ofac_searcher
NodeJS server which mimics Office of Foreign Assets Control searching of blacklist entities. Enables fuzzysearch on names.

## Pre-req

<ul>
    <li> Postgres running server with ADD, ALT, SDN, CONS_PRIM, CONS_ADD, CONS_ALT tables </li>
    <li>NodeJS</li>
</ul>

## To run
``` 
$npm install
$node server.js
```
On curl or postman, a single post request to
```
https://localhost:3000/verifyOfac
```
with a body parament in the format of 
```
{
    "name": "string"
}
```
Response will be in the format of
``` json
    "results": [
        {
            "score": 0,
            "matched_names": [
                "HASSAN AYASH EXCHANGE COMPANY",
                "HASSAN AYAS PARTNER EXCHANGE CO",
                "AYASH XCHANGE CO.",
                "AYASH EXCHANGE COMPANY SARL",
                "MAKDESSI SAYRAFI COMPANY",
                "HASSANE AYASH EXCHANGE CO. SARL",
                "HASSAN AYACH EXCHANGE"
            ]
        },
        {
            "score": 17,
            "matched_names": [
                "AL-DULAYMI, Hasan Hashim Khalaf"
            ]
        }
    ],
    "min_score": 0,
    "ofac_passed": false,
    "max_percentage": 100,
    "l_score_threshold": 28
```

Where the the lesser the score, the more closer it is to the searched string with 0 or 1 being a perfect match.

ofac_passed parameter can be changed to meet passing requirements.


