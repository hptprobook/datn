/* eslint-disable no-console */
import { io } from 'socket.io-client';
import { API_ROOT } from '~/utils/constants';

const socket = io(API_ROOT);

socket.on('connect', () => {
  console.log('Connected to the server with id:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;
