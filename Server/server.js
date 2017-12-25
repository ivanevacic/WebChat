const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;  //config for heroku
var app = express();

var server = http.createServer(app);
var io = socketIO(server); //web socket server

app.use(express.static(publicPath));

//register event listener
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
 

  socket.on('createMessage', (message, callback)=> {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text)); 
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords)=> {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', ()=> {
    console.log('User was disconnected from server');
  });
});     

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});