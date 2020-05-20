'use strict';

require('dotenv').config();
const express = require('express');
const pg =require('pg');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;
const books = [];

//view engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('./public')); // serves static files that live in the specified folder
app.use(express.urlencoded({extended : true})); // puts FORM info into the req.body

const client = new pg.Client('postgres://ncarignan:password@localhost:5432/ncarignan');
client.on('error', console.error);
client.connect();

// routes

app.get('/', displaySavedBooks);
app.get('/books/:id', displaySingleBook);
app.post('/books', saveBook);

app.get('/searches/new', displaySearchPage);
app.post('/searches', makeAndDisplaySearch);

// functions / callbacks

function displaySavedBooks (req, res){
  // pull from the `db`, display it, send the data to ejs
  res.render('homepage.ejs', {savedBooks : books});
}

function displaySingleBook(req, res) {
  const book = books.filter(book => book.id.toString() === req.params.id ? true : false)[0];
  res.render('singleBook.ejs', {book : book});
}

function saveBook(req, res) {
  console.log(req.body);
  const newBook = req.body;
  newBook.id = books[books.length -1].id + 1;
  books.push(newBook);
  res.redirect('/').status(201);
}

function displaySearchPage(req, res) {
  res.render('bookform.ejs');
}

function makeAndDisplaySearch(req, res) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=in${req.body.search[1]}:${req.body.search[0]}`;

  superagent.get(url)
    .then(result => {
      // where is the data from a superagent.get
      // always in the body, unless the api is really hard for superagent to read

      const books = result.body.items.map(bigObj => ({
        title : bigObj.volumeInfo.title,
        author: bigObj.volumeInfo.authors && bigObj.volumeInfo.authors[0],
        img: bigObj.volumeInfo.imageLinks ? bigObj.volumeInfo.imageLinks.thumbnail : 'https://www.adazing.com/wp-content/uploads/2019/02/open-book-clipart-03.png'

      }));

      res.render('results.ejs', {savedBooks: books});
    });
}

books.push(
  {
    id : 1,
    title: 'Name of the Wind',
    author: 'Patrick Rothfuss',
    img: 'https://www.adazing.com/wp-content/uploads/2019/02/open-book-clipart-03.png'
  },
  {
    id: 2,
    title : 'Dune',
    author: 'Frank Herbert',
    img: 'https://www.adazing.com/wp-content/uploads/2019/02/open-book-clipart-03.png'
  }
);

app.listen(PORT, () => console.log(`yer a wizzard, ${PORT}`));
