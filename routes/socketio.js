var socket_io = require('socket.io')
var io = {}



module.exports = {
  getSocketio : function(server){
    io = socket_io.listen(server);

    io.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });//触发news事件

      socket.on('my other event', function (data) {
        console.log(data);
      });
    })
  },
  io:io,//io对象
  sendinfo:function(){
    io.emit('news',{info:'主动发送的消息'})
  }
  
}
