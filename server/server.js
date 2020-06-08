const http = require('http'); //import HTTP
const express = require('express'); // import express
const socketio = require('socket.io');// import socket.io

const RpsGame = require('./rps-game');

//express handling the connection
const app = express();

//locate client path
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

//middleware! from app (sever) to client 
app.use(express.static(clientPath));

//Creates an HTTP server
const server = http.createServer(app);

//pass HTTP server into socketio function. so server can talk to client 
const io = socketio(server);

let waitingPlayer = null;

//whenever a user connection 
io.on('connection', (sock) => {

  if (waitingPlayer) { //if waitingPlayer is true
    new RpsGame(waitingPlayer, sock); //call class RPSgame the two players
    waitingPlayer = null;
  } else { //if waitingPlayer is null
    waitingPlayer = sock; //set to sock
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

//if server has a error pass error to console
server.on('error', (err) => {
  console.error('Server error:', err);
});

//server on port 8080 
server.listen(8080, () => {
  console.log('RPS started on 8080');
});