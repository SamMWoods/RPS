//will write text into the chat window
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  //Create a new  list item element
  const el = document.createElement('li');
  el.innerHTML = text;

  //append it to the end of the parent body
  parent.appendChild(el);
};

//when user picks RPS
const addButtonListeners = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => { //ID of the Buttons
    const button = document.getElementById(id); //store ID tag in button variable
    button.addEventListener('click', () => { //when button clicked
      sock.emit('turn', id); //emit to rps-game.js
    });
  });
};

writeEvent('Welcome to RPS');

//global object io() to establish a connect to the server.js
const sock = io();
sock.on('message', writeEvent);  //listen to the event

addButtonListeners();
