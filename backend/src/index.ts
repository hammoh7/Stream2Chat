import { Socket } from "socket.io";
import http from "http";

import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/user";

const app = express();
const server = http.createServer(http);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('User connected');
  userManager.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("User disconnected");
    userManager.removeUser(socket.id);
  })
});

server.listen(3000, () => {
    console.log('Server running:3000');
});