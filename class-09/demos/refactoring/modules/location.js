const pg = require('pg');
const superagent = require('superagent');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function Location(someArray, search_query) {
  this.search_query = search_query;
  this.latitude = someArray[0].lat;
  this.longitude = someArray[0].lon;
  this.formatted_query = someArray[0].display_name;
}

Location.Query = function (cityToBeSearched) {
  this.q = cityToBeSearched;
  this.key = process.env.GEOCODE_API_KEY;
  this.format = 'json';
};



function handleLocationResultFromSql(resultFromSql, cityToBeSearched) {
  if (resultFromSql.rowCount > 0) {
    return resultFromSql.rows[0]; // returning from a promise, passes the return up the promise chain and into the argument of the next then, just like Leo Di
  } else {
    return goGetNewLocationData(cityToBeSearched);
  }
}

function goGetNewLocationData(cityToBeSearched) {
  const urlOfApi = 'https://us1.locationiq.com/v1/search.php';
  const queryParameters = new Location.Query(cityToBeSearched);

  return superagent.get(urlOfApi)
    .query(queryParameters)
    .then(result => saveAndSendLocation(result, cityToBeSearched)); // .then only passes one argument
}

function saveAndSendLocation(resultFromLocationIQ, cityToBeSearched) {
  const newLocation = new Location(resultFromLocationIQ.body, cityToBeSearched);

  const sqlQuery = 'INSERT INTO locations (latitude, search_query, longitude, formatted_query ) VALUES($1, $2, $3, $4)';

  const valueArray = [newLocation.latitude, newLocation.search_query, newLocation.longitude, newLocation.formatted_query];

  client.query(sqlQuery, valueArray);

  return newLocation;
}


function getLocation(request, response) {
  const cityToBeSearched = request.query.city;
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const sqlValues = [cityToBeSearched];

  client.query(sqlQuery, sqlValues)
    .then(sqlResult => handleLocationResultFromSql(sqlResult, cityToBeSearched))
    .then(resultFromEitherApiOrSQl => response.send(resultFromEitherApiOrSQl));
}

module.exports = getLocation;
