'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());


app.get('/location', getLocation);

app.get('/restaurants', (req, res) => {
  const url ='https://developers.zomato.com/api/v2.1/geocode';

  const queryForSuper = {
    lat: req.query.latitude,
    lng: req.query.longitude
  };

  superagent.get(url)
    // .set('user-key', process.env.ZOMATO_API_KEY) // used to set headers user-key = zomato key
    .query(queryForSuper)
    .then(resultFromSuper => {
      console.log(resultFromSuper.body);

      const nearby_restaurants = resultFromSuper.body.nearby_restaurants;
      const newRests = [];

      for (let i = 0; i < nearby_restaurants.length; i++) {
        newRests.push(new Restaurant(nearby_restaurants[i]));
      }

      console.log(newRests);
      res.send(newRests).status(200);
    })
    .catch(error => {
      console.log(error);
      res.send(error).status(500);
    });

});

function getLocation(request, response) {

  // TODO: get data from front end
  console.log(request.query); // .query is where the query parameters from the front end are


  const cityToBeSearced = request.query.city;
  const urlOfApi = 'https://us1.locationiq.com/v1/search.php';

  const queryParameters = { // used by superagent
    q: cityToBeSearced,
    key: process.env.GEOCODE_API_KEY,
    format: 'json'
  };

  //this is an object put together with the key value pairs the api requests

  superagent.get(urlOfApi)
    .query(queryParameters)
    .then(resultFromLocationIQ => {
      const newLocation = new Location(resultFromLocationIQ.body);
      response.send(newLocation);
    });
}

function Location(someArray) {
  this.search_query = someArray[0].display_name;
  this.latitude = someArray[0].lat;
  this.longitude = someArray[0].lon;
  this.formatted_query = someArray[0].display_name;
}

function Restaurant(potatoEntireObject){
  this.restaurant = potatoEntireObject.restaurant.name;
  this.cuisines = potatoEntireObject.restaurant.cuisines;
  this.locality = potatoEntireObject.restaurant.location.locality;
}

// We run the server
app.listen(PORT, console.log(`we are up on ${PORT}`));
