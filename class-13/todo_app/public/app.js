'use strict';

console.log('yo from the app.js');

const button = document.getElementById('update');

const form = document.getElementById('form');

form.style = 'display : none';

button.addEventListener('click', () => {
  form.style = '';
});
