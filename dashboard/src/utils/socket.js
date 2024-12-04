/* eslint-disable */
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_APP_URL);

socket.on('connect', () => {
  console.log('Connected to the server with id:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;
