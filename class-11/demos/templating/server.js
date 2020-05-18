'use strict';

const express =require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// for the case of forms (eventually)
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public')); //helps the frontend

// configs
// any time we render with express, use ejs
// render === build a page in express
app.set('view engine', 'ejs');

const listOfGroceries = ['milk', 'oreos', 'bananas', 'beer', 'half n half'];

const quantities = [
  { name: 'milk', quantity: 17 },
  {name : 'oreos', quantity: 'all'},
  {name : 'bananas', quantity: 3},
  {name : 'beer', quantity: 'all'},
  { name: 'half n half', quantity: 0.5 },
];


app.get('/', (req, res) => {
  // the render takes in a filename
  // the file MUST  live inside a folder called `views`
  // the views folder must live at the same level as the package.json / server.js
  // I am 99% sure this should not be preceded by a '/' in any situation
  res.render('home-template-potato');
  // res.render('home-template-potato.ejs'); // either of these works
});

app.get('/list', (req, res) => {
  // the second argument is an object, where the keys are the template variables
  res.render('shopping', {arrayOfShoppingItems : listOfGroceries});
});

app.get('/quantities', (req, res) => {
  res.render('quantities', { arrayOfShoppingItemObjects : quantities} );


});

app.post('/quantities', (req, res) => {
  // add a thing to the array
  //then what
  // show it on the screen
  // res.render()
  // console.log(req.body);
  quantities.push(req.body);
  res.redirect('/quantities');
});

/*
//server needs this config
app.set('view engine', 'ejs');

//to render a file
res.render('<filename that exists in the `views` folder>');

// to render a file with data
res.render('<filename>', {keyUsedAsVarInEjsFile : <value>});

//in ejs
the <%= displays a variable
<%= keyUsedAsVarInEjsFile %>

the <% uses the variable like normal js
ie : <% keyUsedAsVarInEjsFile.forEach(() => { %>
  inside you can put any regular html that would then be put on the page
<% }) %>

*/

app.listen(PORT, () => console.log(`whazzup on PORT ${PORT}`));
