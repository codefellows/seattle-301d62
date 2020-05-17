'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


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
      // console.log(error);
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

  // if the data is in the database, use it instead
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const sqlValues = [cityToBeSearced];
  client.query(sqlQuery, sqlValues)
    .then(resultFromSql => {
      console.log(resultFromSql);

      if(resultFromSql.rowCount > 0){
        //send them the stuff from sql
        // send a location looking object, object with search_query, formatted_query...
        response.send(resultFromSql.rows[0]);
      } else {
        superagent.get(urlOfApi)
          .query(queryParameters)
          .then(resultFromLocationIQ => {
            const newLocation = new Location(resultFromLocationIQ.body, cityToBeSearced);

            // TODO: save into db
            const sqlQuery = 'INSERT INTO locations (latitude, search_query, longitude, formatted_query ) VALUES($1, $2, $3, $4)';

            const valueArray = [newLocation.latitude, newLocation.search_query, newLocation.longitude, newLocation.formatted_query];

            client.query(sqlQuery, valueArray);

            response.send(newLocation);
          });
      }


    });
  // else go on the internet



}

function Location(someArray, search_query) {
  this.search_query = search_query;
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
