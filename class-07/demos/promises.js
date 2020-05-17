'use strict';

const longTask = (status) => {
  return new Promise(
    (resolve, reject) =>{
      let timer = Math.floor(Math.random() *3000);
      setTimeout( () => {
        if(status === 'good'){
          resolve(` status : ${timer} : ${status}`); // success
        } else {
          reject( 'bad' ); // not success
        }
      }, timer);
    });
};

// const result = longTask('good');
// console.log(result);

longTask('good')
  .then((resultFromThePromise) => console.log(resultFromThePromise));

longTask('banana')
  .then((resultFromThePromise) => console.log(resultFromThePromise))
  .then(() => {
    console.log('i am second in the chain');
    return 'hello world from the second chain';
  })
  .then(returnOfPrev => {
    console.log(returnOfPrev);
  })
  .catch((errorFromPromise) => console.log(errorFromPromise));

