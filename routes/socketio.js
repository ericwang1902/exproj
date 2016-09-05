var express = require('express');
var app = express();//获取app对象

var io = require('socket.io')(app);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });//触发news事件
  
  socket.on('my other event', function (data) {
    console.log(data);
  });
})