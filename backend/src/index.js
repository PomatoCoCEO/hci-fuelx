import { createServer } from 'http';
import { Server } from 'socket.io';
import Game from './game.js';

const SERVER_PORT = 4000;
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let game = new Game();
game.subscribe((command) => {
    console.log(`Broadcast: ${command.type}`);
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
        game.movePlayer(command.name, command.x, command.y, command.direction);
    });
});

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server listening on port: ${SERVER_PORT}`);
});
