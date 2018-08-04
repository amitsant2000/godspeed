var express = require('express');
var path = require('path');
var morgan = require('morgan');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exphbs = require('express-handlebars');
var rooms = []
app.engine('hbs', exphbs({
  extname: 'hbs'
}));
app.set('view engine', 'hbs');
io.on('connection', function(socket) {
  socket.on('sendme',function(mover){
    if(!socket.user){
      socket.user = mover.username;
    }
    socket.broadcast.emit('enemysent',mover)
  })
  socket.on('sendbullet',function(mover){
    socket.broadcast.emit('enemybullet',mover)
  })
  socket.on('hit',function(a){
    io.emit('enemysent',a)
  })
});
var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
