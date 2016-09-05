var socketio={}
var socket_io = require('socket.io')

socketio.getSocketio = function(server){
  var io = socket_io.listen(server);

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });//触发news事件
    
    socket.on('my other event', function (data) {
      console.log(data);
    });
  })
};

module.exports = socketio;
