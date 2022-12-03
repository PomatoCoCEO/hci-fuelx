import { createServer } from 'http';
import { Server } from 'socket.io';
import Game from './Game.js';

const SERVER_PORT = 8080;
const httpServer = createServer();
export const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

function notify(socket, command) {
    console.log(`PRIVATE | ${(new Date()).toUTCString()} | ID: ${socket.id} | TYPE: ${command.type}`);
    socket.emit(command.type, command);
}

function notifyRoom(room, command) {
    console.log(`ROOM-BROADCAST | ${(new Date()).toUTCString()} | TYPE: ${command.type}`);
    io.to(room).emit(command.type, command);
}

let game = new Game(notify, notifyRoom);


game.subscribe((command) => {
    console.log(`GAME-BROADCAST | ${(new Date()).toUTCString()} | TYPE: ${command.type}`);
    io.sockets.emit(command.type, command);
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        game.disconnectPlayer(socket.id);
    });

    socket.on('move-player', (command) => {
        game.movePlayer(command);
    });

    socket.on('drill', (command) => {
        game.drill(command);
    });

    socket.on('share', (command) => {
        game.share(command);
    });

    socket.on('steal', (command) => {
        game.steal(command);
    });

    socket.on('flee', (command) => {
        game.flee(command);
    });

    socket.on('attack', (command) => {
        game.attack(command);
    });

    socket.on('collect', (command) => {
        game.collect(command);
    });

    socket.on('commit', (command) => {
        game.commit(command);
    });

    socket.on('list-rooms', (command) => {
        game.listRooms(socket, command);
    });

    socket.on('create-room', (command) => {
        game.createRoom(socket, command);
    });

    socket.on("connect-player", (command) => {
        socket.join(command.args.room);
        console.log(`CONNECTION | ${(new Date()).toUTCString()} | ID: ${socket.id}`);
        game.connectPlayer({
            room: command.args.room,
            playerId: command.args.playerId,
            name: command.args.name,
            socket: socket
        });
        game.sendKey(socket.id);
    });
});

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server listening on port: ${SERVER_PORT}`);
});
