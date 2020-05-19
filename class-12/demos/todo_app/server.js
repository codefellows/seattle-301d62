'use strict';

require('dotenv').config();
const express =require('express');

const PORT = process.env.PORT;
const app = express();

// configure the app
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true})); // takes the encrypted/ hidden info from the url - puts it in request.body
app.use(express.static('./public'));

// pg setup
const client = require('./modules/pg_client.js');

app.get('/', (req, res) =>{
  //render a page that uses data from the database
  const getTheRedBalloon = require('./modules/ballooning.js');
  console.log(getTheRedBalloon());

  client.query('SELECT * FROM tasks')
    .then(result => {
      res.render('pages/index.ejs', { tasksArr : result.rows});
    })
    .catch(console.log);
});

app.get('/tasks/:id', (req, res) => {
  // :id is a dynamic route,
  // :id is called a path variable / parameter
  console.log('req.params', req.params);
  // choosing from the db a specific tasks, based on the id

  client.query('SELECT * FROM tasks WHERE id=$1', [req.params.id])
    .then(dataFromSql => {
      /*
        { id: 1,
          category: 'schoolwork',
          priority: 1,
          completed: false,
          planned_time_in_seconds: 8000,
          title: 'finish lab 11',
          description: 'connect api properly' }
  since that is my object, if i pass it to ejs, i can use category, priority and the other keys as variables from my ejs file

      */
      res.render('pages/showOneTask', dataFromSql.rows[0]);
    });

});


// category VARCHAR(255),
// priority SMALLINT,
// completed BOOLEAN,
// planned_time_in_seconds INTEGER,
// title VARCHAR(255),
// description VARCHAR(511)

app.listen(PORT, () => console.log(`scooby dooby ${PORT}`));


/*
issue driven development
1  no connection to db, made a db
2. no table :  made a table
3. no data to render : made a few things in the table
4. nothing being sent to the frontend : just send the data
5. they don't see a nice page : render some ejs


for task 2
- goal is to query a single thing from the db - requires a new ejs file, and a dynamic route that can be used to render a specific task
*/

/*
for path variables
if our route path is  /something/:potato/:tomato
if we visit localhost:3000/something/russet/heirloom
req.params will be { potat: 'russet', tomato: 'heirloom' }



*/

/*
  render requires a path like pages/index.ejs
  express.static requires ./public
  required local modules requires ./modules/pg_client.js
*/

