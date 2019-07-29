# ofac_searcher
NodeJS server which mimics Office of Foreign Assets Control searching of blacklist entities. Enables fuzzysearch on names.

## Pre-req

<ul>
    <li> Postgres running server with ADD, ALT, SDN, CONS_PRIM, CONS_ADD, CONS_ALT tables </li>
    <li>NodeJS</li>
</ul>

## To run
```
npm install
node server.js
```
On curl or postman, a single post request to
```
https://localhost:3000/verifyOfac
```
with a body parament in the format of 
```
{
    "name"; <name to search>
}
```


