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
{
    "results": {
        "2": [
            "KONY, Salim",
            "SALEH, Salim"
        ],
        "5": [
            "SALIM S.A."
        ],
        "6": [
            "SYAWAL, Yassin",
            "YASIN, Salim"
        ],
        "7": [
            "KONY, Salim",
            "KONY, Salim Saleh",
            "OGARO, Salim Saleh Obol"
        ],
        "10": [
            "AL-KUWARI, Salim Hasan Khalifah Rashid",
            "AL-KUWARI, Salem"
        ],
        "11": [
            "AL-KUWARI, Salim Hasan Khalifah Rashid",
            "AL-KOWARI, Salim"
        ]
    },
    "minimum_score": "2",
    "ofac_passed": false,
    "l_score_threshold": 12
}
```

Where the the lesser the score, the more closer it is to the searched string with 0 or 1 being a perfect match.

ofac_passed parameter can be changed to meet passing requirements.


