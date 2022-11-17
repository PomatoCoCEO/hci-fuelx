import { createServer } from 'http';
import { Server } from 'socket.io';
import Game from './Game.js';
import Room from './Room.js';

const SERVER_PORT = 8080;
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let game = new Game();
let room = new Room();
game.subscribe((command) => {
    console.log(`GAME-BROADCAST | ${(new Date()).toUTCString()} | TYPE: ${command.type}`);
    io.sockets.emit(command.type, command);
});

room.subscribe((command) => {
    console.log(`ROOM-BROADCAST | ${(new Date()).toUTCString()} | TYPE: ${command.type}`);
    io.sockets.emit(command.type, command);
});
io.on('connection', (socket) => {
    console.log(`Player ${socket.id} connected`);
    game.connectPlayer(socket.id);

    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`);
        game.disconnectPlayer(socket.id);
    });

    socket.on('move-player', (command) => {
        game.movePlayer(command);
    });

    socket.on('drill', (command) => {
        game.drill(command);
    });

    socket.on('collect', (command) => {
        game.collect(command);
    });

    socket.on('list-rooms', (command) => {
        room.list(socket, command);
    });

    socket.on('create-room', (command) => {
        room.create(socket, command);
    });
});

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server listening on port: ${SERVER_PORT}`);
});
