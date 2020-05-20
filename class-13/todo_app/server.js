'use strict';

require('dotenv').config();
const express =require('express');
const methodOverride = require('method-override');

const PORT = process.env.PORT;
const app = express();

// configure the app
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true})); // takes the encrypted/ hidden info from the url - puts it in request.body
app.use(express.static('./public'));
// app.use(methodOverride('potato')); // changes method to whatever the query parameter potato equals
app.use(methodOverride('_overrideMethod'));

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

// for an update we need an app.put put stands for update
// lets just do an app.post since that is what we are limited to

app.put('/tasks/:id/update', actualUpdateTask);

function actualUpdateTask(req, res) {
  console.log('request on a PUT route : success!!!');
  console.log('body', req.body);
  // console.log('params', req.params);

  const sql = `
    UPDATE tasks 
    SET title=$2, description=$3
    WHERE id=$1
  `;
  const values = [req.params.id, req.body.title, req.body.description];

  client.query(sql, values)
    .then(() => {
      res.redirect(`/tasks/${req.params.id}`);
    });

}

// category VARCHAR(255),
// priority SMALLINT,
// completed BOOLEAN,
// planned_time_in_seconds INTEGER,
// title VARCHAR(255),
// description VARCHAR(511)

app.listen(PORT, () => console.log(`scooby dooby ${PORT}`));


/*
  first we install method-override
  then we use method-override
  app.use(methodOverride('INSERT query paramater NAME HERE'))
  add a query parameter to your form's action of QUERYPARAMTERNAME=PUT

  app.use(methodOverride('_potato'))
  form needs
  action="/farming/fields/10?_potato=DELETE" method="POST"

  another form
  action="/farming/fields/10?_potato=PUT" method="POST"
  action="/farming/strawberries/5?_potato=PUT" method="POST"
  action="/farming/strawberries/5?_potato=DELETE" method="POST"
  action="/farming/strawberries" method="POST"
*/

