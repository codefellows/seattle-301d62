const superagent = require('superagent');

function Restaurant(potatoEntireObject) {
  this.restaurant = potatoEntireObject.restaurant.name;
  this.cuisines = potatoEntireObject.restaurant.cuisines;
  this.locality = potatoEntireObject.restaurant.location.locality;
}

Restaurant.Query = function (potatoQuery) {
  this.lat = potatoQuery.latitude;
  this.lng = potatoQuery.longitude;
};

function getRestaurants(req, res) {
  const url = 'https://developers.zomato.com/api/v2.1/geocode';
  const queryForSuper = new Restaurant.Query(req.query);

  superagent.get(url)
    .set('user-key', process.env.ZOMATO_API_KEY) // used to set headers user-key = zomato key
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

}

module.exports = {
  get : getRestaurants,
  cool: 'beans'
};
