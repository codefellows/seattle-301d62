'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());

// database config
const client = new pg.Client(process.env.DATABASE_URL);
// postgres://<usernameForPostgres>:<passWordForPostgres>@localhost:<hostForPg>/<DatabaseNAme>
client.on('error', console.error); // only difference is color for console.error
client.connect();

const students = [];

function Student(name, hobby, pastLife){
  this.name = name;
  this.hobby = hobby;
  this.pastLife = pastLife;
}

app.get('/', (req, res) => {
  const sqlQuery = 'SELECT * FROM students';
  client.query(sqlQuery)
    .then(whateverComesBack => {

      res.send(whateverComesBack.rows);

    })
    .catch(console.error);

});

app.get('/addStudent', (req, res) => {
  console.log(req.query);
  const {name, hobby, pastLife} = req.query;

  // put it in the db, pg template
  const sqlQuery = 'INSERT INTO students (name, hobby, pastlife) VALUES ($1, $2, $3)';

  //$1, $2, $2 correspond :
  //                 [ $1  , $2,    $3]
  const valueArray = [name, hobby, 'oreos'];

  // it is pg
  client.query(sqlQuery, valueArray);


  res.send('hi there ' + name);
});


app.listen(PORT, () => console.log(`up on port : ${PORT}`));
