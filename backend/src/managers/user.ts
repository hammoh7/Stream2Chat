import { Socket } from "socket.io";
import { RoomManager } from "./room";

export interface User {
  name: string;
  socket: Socket;
}

export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    this.matchQueue();
    this.initHandlers(socket);
  }

  removeUser(socketId: string) {
    const user = this.users.find((x) => x.socket.id === socketId);
    this.users = this.users.filter((x) => x.socket.id === socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }

  matchQueue() {
    if (this.queue.length < 2) {
      return;
    }
    const id1 = this.queue.pop();
    const id2 = this.queue.pop();
    console.log("ID's are:- " + "Id-1: " + id1 + " " + "Id-2: " + id2);
    const user1 = this.users.find((x) => x.socket.id === id1);
    const user2 = this.users.find((x) => x.socket.id === id2);
    if (!user1 || !user2) {
      return;
    }
    console.log("Creating room");
    this.matchQueue();
  }

  initHandlers(socket: Socket) {
    socket.on("offer", ({sdp, roomId}: {sdp: string, roomId: string}) => {
        this.roomManager.onRequest(roomId, sdp, socket.id);
    })

    socket.on("answer",({sdp, roomId}: {sdp: string, roomId: string}) => {
        this.roomManager.onAnswer(roomId, sdp, socket.id);
    })
  }
}
