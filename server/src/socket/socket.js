const { Server } = require('socket.io');
const express = require('express');
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3030',
      'http://localhost:3000',
      'https://bmt-life.vercel.app',
      'https://dashboard-bmt-life.vercel.app',
    ],
    credentials: true,
  },
});

let activeUsers = [];

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  const userExists = activeUsers.some((user) => user.userId === userId);
  if (!userExists) {
    activeUsers.push({
      userId: userId,
      socketId: socket.id,
    });
    console.log('a new connected', activeUsers);
  }
  io.emit('getOnlineUser', activeUsers);

  socket.on('addOrder', ({ userId, data }) => {
    const targetUser = activeUsers.find((user) => user.userId === userId);

    if (targetUser) {
      io.to(targetUser.socketId).emit('receiveNotifies', { data });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    const index = activeUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      activeUsers.splice(index, 1);
    }
    io.emit('getOnlineUser', activeUsers);
  });
});

module.exports = { app, io, server };
