var app = require('express')();
var server = require('http').createServer(app);
var socketio = require('socket.io').listen(server);
var roomName = "MegaTransfer";

server.listen(80);

app.get('/', function (req, res) {
  res.send('Hello, Welcome to MegaTransfer. Please use android and not browser. You stupid.');
});

socketio.on('connection', function (socket) {


	var id = (Math.random().toString(10) + '0000000000000000000').substr(2, 4);

	socket.set("username", id);
	socket.join(roomName);
	socket.emit('id', id);
	

	socket.on('message', function (message) {

		var clients = socketio.sockets.clients(message.room);

		var socketid = '';

		var i = 0;
		clients.forEach(function(client) {
			client.get('username', function(err, nickname) {
				if(nickname == message.to)
					socketid = client.id;
				i++;
			})
		});


      var msgToSend = message.msg;

      if(typeof msgToSend != 'object')
        msgToSend = JSON.parse(msgToSend);

		socketio.sockets.socket(socketid).emit('message', msgToSend);

	});

		
});