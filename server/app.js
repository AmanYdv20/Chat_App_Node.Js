const path = require('path');
const http = require('http');
const express = require('express');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=> {
  console.log('new user connected');

  socket.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user connected'));

//adding callback to function so that error can be handled
  socket.on('createMessage', (message, callback)=> {
    console.log('createmessage', message);
      io.emit('newMessage', generateMessage(message.from, message.text));
      callback();
  });

  socket.on('createlocationMessage', (coords)=> {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitute, coords.longitute));

  });

  socket.on('disconnect', ()=> {
    console.log('Disconncted to server');
  });
});


server.listen(3000, ()=> {
  console.log('appcamp is started at port 3000');
});
