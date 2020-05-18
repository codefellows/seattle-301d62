'use strict';

// packages
const express = require('express');

// global variables / app setup
const app = express();
const PORT = process.env.PORT || 3000;
// not using the package `dotenv`, `dotenv` refers to the `.env` file, process.env refers to the terminal environment

// configuration / middleware
app.use(express.static('./publicPotaTO')); // which front end files to serve
// middleware to create req.body for POST from forms
app.use(express.urlencoded( {extended:true} ));

app.get('/testQuery', (req, res) => {
  // http://<url>/<route>?<queryParameter>=queryParametervalue>&<queryParameter>=queryParametervalue>

  // http://localhost:3001/testQuery?potatoMonster=cookie+monster
  // by default it sends the data in the url as query parameters
  console.log(req.query);
  res.send('you did good lil form');
});

// first thing to remember is app.post instead of app.get
app.post('/contact', (req, res) => {
  // http://localhost:3001/contact
  console.log('req.query from /contact', req.query);
  console.log('req.body from /contact', req.body);
  res.send('you did great posty form');
});



// ======== form cheatsheet
/*
express now requires this middleware
app.use(express.urlencoded( {extended:true} ));

the action matches the route on the server, the method matches the method type
<form action="/potato" method="POST">
      you need an input with a `name` and a way to submit the form
      <input type="text" name="firstName">
      <input type="submit">
  </form>

  app.post('/potato', (req, res) =>{
    console.log(req.body.firstName)
  })

*/


// start the app
app.listen(PORT, () => console.log(`App is up on PORT : ${PORT}`));
