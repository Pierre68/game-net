console.log("launching app game-net")
const server_version = "0.0.1"

var express = require('express')
//var socket = require('socket.io')

var app = express()
var SERVER_PORT = process.env.PORT || 8080
var server = app.listen(SERVER_PORT)
console.log("........... on port : " + SERVER_PORT);
app.use(express.static('Public'))

console.log("server version " + server_version);

//=============================================================================

//var io = socket(server)

var io = require('socket.io')({
	transports: ['websocket'],
});

io.on('connection', newConnection)

var connections = 0


function newConnection(socket) {
  connections++;
  console.log("new connection:" + socket.id);
  //events setup for communication
  socket.on('disconnect', clientDisconnection)
  socket.on('message', clientMessage)
  socket.on('data', clientData)

  //on connection
  socket.join("room")
  //send test message
  io.to("room").emit('message', 'users online:' + connections)

  function clientMessage(data) {
    console.log(data);
    //socket.broadcast.emit('message', data) // only others
    //io.sockets.emit('message', data) //everyone connected
  }

  function clientData(dataString) {
    try {
      var data = JSON.parse(dataString)

      if (data.request == "changeRoom") {
        changeRoom(data)

      }else if (data.request == "data"){
        var room = io.sockets.manager.roomClients[socket.id]
        io.to(room).emit('data', JSON.stringify(data))
      }

    } catch (e) {
      console.log(dataString);
      console.log(e);
    }
  }

  function clientDisconnection(data) {
    connections--;
    console.log(data)
    //io.to("room").emit('message', 'users online:' + connections)
  }

  function changeRoom(data) {
    console.log("changing room: " + data.room);
    socket.join(data.room)
  }


}
