/* global $, Handlebars */
'use strict';

/*

My goal is to show some city info after a form is submitted
I want to show a map
I want to list some restaraunts that are nearby

*/
// start with the model,  a constructor for each file:
// Location
// array of RestaruantInfos

function Location(id, search_query, formatted_query, latitude, longitude, created_at){
  this.id = id;
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
  this.created_at = created_at;
}

Location.prototype.render = function () {
  const template = Handlebars.compile($('#restaurant-template').html());
  const result = template(this);
  $('#map').append(result);
};

function RestaurantInfo(restaurant, cuisines, locality){
  this.restaurant = restaurant;
  this.cuisines = cuisines;
  this.locality = locality;
}

RestaurantInfo.prototype.render = function(){
  const template = Handlebars.compile($('#info-template').html());
  const result = template(this);
  $('#restaurant-list').append(result);
};

const dealWithLocationData = data => {
  // reconstitute
  const newLocation = new Location(data.id, data.search_query, data.formatted_query, data.latitude, data.longitude, data.created_at);
  newLocation.render();
  return newLocation;
};

const goGetRestaraunts = function(location){
  console.log('in goGetRest : ', location);
  // go to a server living on port 3000 to the /restaurants route to get this data
  return $.get(`http://localhost:3000/restaruants?${location.latitude}x${location.longitude}`);
  // this is nonsense - if it doesnt make sense, it should monday - again, you could delete it with no changes to the behavior
  // i would use the location to make a detailed search
};

const dealWithRestaurants = function(dataFromGoGetRestaurants){
  console.log('from deal with r :', dataFromGoGetRestaurants);
  dataFromGoGetRestaurants.forEach(jsonObj => {
    const newRest = new RestaurantInfo(jsonObj.restaurant, jsonObj.cuisines, jsonObj.locality);
    newRest.render();
  });
};

$('#search').on('submit', (event) => {
  // first use 'seattle' to get 'lat' and 'long'
  // then use 'lat', 'lng' to search for restaurants

  // go to the server and ask for some data about locations at the /location route
  event.preventDefault();
  $.get('http://localhost:3000/location')
    .then(dealWithLocationData) // whatever is returned here, is passed to the new .then
    .then(goGetRestaraunts) //whatever is returned here is passed to dealWithRestaurants
    .then(dealWithRestaurants);
});


// use ajax to get the data from the files
// pass the data through the constructor
// (re)constituting the obj
// render the map
// render the list

// Stretch: sort
