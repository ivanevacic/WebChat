const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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
 

  socket.on('createMessage', (message)=> {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text)); 
    //{
      //from: message.from,
      //text: message.text,
      //createdAt: new Date().getTime()
    //});
    //socket.broadcast.emit('newMessage', {
      //from: message.from,
      //text: message.text,
      //createdAat: new Date().getTime()
    //});
  });

  socket.on('disconnect', ()=> {
    console.log('User was disconnected from server');
  });
});     

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});