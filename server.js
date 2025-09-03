const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    socket.to(roomId).emit('message', { username: 'System', text: `${username} joined!` });
  });

  socket.on('chatMessage', ({ roomId, username, text }) => {
    io.to(roomId).emit('message', { username, text });
  });
});

app.get('/', (req, res) => {
  res.send('Chat server running');
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
