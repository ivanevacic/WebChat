const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;  //config for heroku
var app = express();

var server = http.createServer(app);
var io = socketIO(server); //web socket server

app.use(express.static(publicPath));

//register event listener
io.on('connection', (socket) => {
  console.log('New user connected');

  //create event
  socket.emit('newMessage',{
    from: 'wge@gmail.com',
    text: 'see you then',
    createdAt: 123245
  });

  socket.on('createMessage', (message)=> {
    console.log('createMessage', message);
  });

  socket.on('disconnect', ()=> {
    console.log('User was disconnected from server');
  });
});     

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});