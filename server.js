const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();
const messages = [];
const users = [];
app.use(express.static(path.join(__dirname, '/client')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});
//podpinamy do serwera sockety
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
});
    socket.on('join', (user) => {
      users.push(user);
      console.log(users);
      socket.broadcast.emit('join', {user: 'ChatBot', content: `${user.user} has joined this chat!`});
    });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');

    const removedUser = users.filter(user => user.id === socket.id)[0];
   if (removedUser !== undefined) {
    users.splice(users.indexOf(removedUser), 1);
    socket.broadcast.emit('removeUser', {user: 'ChatBot', content: `${removedUser.user} has left the conversation!`});
}

  });

});
