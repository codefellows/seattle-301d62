'use strict';

let people = {
  carol : {
    name: 'Carol Baskin', age : 30
  },
  king : {
    name: 'joe exotic', age: 60
  },
  jeff : {
    name: 'jeff lowe', age: 55
  }
};

console.log(people);
// these are not prototype methods, they belong to `Object`
// Object.keys, Object.values, Object.entries
// Object.keys input an object, output: array, an array of the keys of the object

console.log(Object.keys(people));
const arrOfKeys = Object.keys(people.carol);
console.log(arrOfKeys);

// Object.values input is an object, output is an array of values

const vals = Object.values(people);
console.log('vals', vals);

const valsOfJoe = Object.values(people.king);
console.log('valsOfJoe', valsOfJoe);

const flavors = {
  'mint-chip' : {
    flavor: 'mint chip', yum : 9
  },
  coffee : {
    flavor: 'coffee', yum : 10
  },
  'oreos-and-cream' : {
    flavor: 'oreo', yum: 8
  }
};

// PD: my label machine broke and can only put 7 letter icecream flavors out
// the purpose for being able to access keys is to base logic on said keys

Object.keys(flavors)
  .forEach(keyOfFlavor =>{

    if(keyOfFlavor.length > 7){
      console.log(
        `key : ${keyOfFlavor} ::: ${flavors[ keyOfFlavor ].flavor} is this yummy ${flavors[keyOfFlavor].yum} but has too long of a name`
      );
    }
  });

// Object.entries
// input: object
// output type: array
// output: array of arrays of key value pairs

console.log(Object.entries(flavors));


const letters = {
  a : 7,
  b : 6,
  c: 5,
  d : 4,
  e : 3,
  f: 2
};

const entries = Object.entries(letters);
console.log(entries);
entries.forEach(entry =>{
  console.log('entry', entry);
  console.log('entry[0]', entry[0]);
  console.log('entry[1]', entry[1]);
  if(entry[1] > 4){
    console.log(entry[0]);
  }
});


const arr = [
  ['nicholas', 'lvl 4 warlock'],
  ['bryant', 'level 2 lawrrior'],
  ['bade', 'level 1 alchemist']
];

arr.forEach(a => {
  console.log(a[0], a[1]);
});
