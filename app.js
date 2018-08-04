var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection',function(socket){
  socket.on('message',function(msg){
    if(socket.username){
      var z = socket.username;
      console.log(z)
      io.emit('serverMsg',{msg:msg,user:z})
    }else{
      socket.emit('alertMsg',"Log in first boyo")
    }
  })
  socket.on('login',function(diseroni){
    if(diseroni.length!==0){
      socket.username = diseroni
      socket.emit('loginResp','You have joined the room')
      socket.broadcast.emit('otherDude',`${diseroni} has joined the room`)
    }else{
      socket.emit('alertMsg','Usename must not be empty')
    }
  })
})
// Set View Engine
app.engine('html', exphbs({
  extname: 'html'
}));
app.set('view engine', 'html');

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
