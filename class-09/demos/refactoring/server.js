'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());

// handlers
const getLocation = require('./modules/location.js');
const restObj = require('./modules/restaurants.js');

console.log('cool :', restObj.cool );
console.log(restObj);
// routes
app.get('/location', getLocation);
app.get('/restaurants', restObj.get);

// We run the server
app.listen(PORT, console.log(`we are up on ${PORT}`));
