# Warm-Up Exercise
Read through this code as if you are the interpreter. Find all of the mistakes in this code and write down the correct syntax for each mistake.

## server.js

```
'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const pg = require('pg');

const client = new pg.Client('postgres://ncarignan:password@localhost:5432/profiles');
client.on('error', e => console.error(e));
client.connect();

//request is a constructed object from express that `represents` the stuff from the front end
// response is a contructed object with info about where to send the response
// query gets filled by express using the data from the front end
// when we `call/invoke` response.send it basically says reply to localhost:8080 with the arguments

app.get('/',  (request, response) => {
  const sql = 'INSERT INTO users (username, password) VALUES ($1, $2)'; // columns in the database
  // pg was written in js, they had all the power to make this decision, they decided to start at 1

  const values = [request.query.username, request.query.password];
  
  client.query(sql, values)
    .then(result => {
      response.send(result.rowCount);
    })
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});
```

## schema.sql

```
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  age INTEGER
);
```
