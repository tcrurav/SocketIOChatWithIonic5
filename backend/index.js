let app = require('express')();

let http = require('http').Server(app);
let io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {

  console.log("someone has connected");

  socket.on('disconnect', function () {
    console.log(`${socket.nickname} has disconnected`);
    io.emit('users-changed', { user: socket.nickname, event: 'left' });
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    console.log(`${socket.nickname} has joined`);
    io.emit('users-changed', { user: nickname, event: 'joined' });
  });

  socket.on('add-message', (message) => {
    console.log(`${socket.nickname} has sent ${message.text}`);
    io.emit('message', { text: message.text, from: socket.nickname, created: new Date() });
  });
});

var port = process.env.PORT || 3001;

http.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});