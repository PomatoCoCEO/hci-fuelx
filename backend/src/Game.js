import Cell from "./Cell.js";
import Player from "./Player.js";
import { utils } from "./utils.js";

export default class Game {

    constructor(notify, notifyRoom) {
        this.observers = [];
        this.rooms = {};
        this.playerRoom = {};
        this.drillCost = 33;
        this.key = Math.floor(Math.random()*(1<<32));
        this.notify = notify;
        this.notifyRoom = notifyRoom;
    }

    instantiatePlayer(room, playerId, name) {
        this.playerRoom[playerId] = room;
        this.rooms[room].players[playerId] = new Player({
            id: playerId,
            name,
            x: 0,
            y: 0,
            direction: 'down',
            game: this
        });
    }

    shortId(playerId) {
        return (`${playerId}`).substring(0, 9);
    }

    subscribe(observerFunction) {
        this.observers.push(observerFunction);
    }

    notifyAll(command) {
        for(let observerFunction of this.observers)
            observerFunction(command);
    }

    disconnectPlayer(playerId) {
        const room = this.playerRoom[playerId]
        if(!room)
            return;
        delete this.rooms[room].players[playerId];
        delete this.playerRoom[playerId];
        this.notifyRoom(room, {
            type: 'disconnect-player',
            args: playerId
        });
        this.notifyRoom(room, {
            type: 'notification',
            args: {
                type: 'error',
                title: 'PLAYER',
                description: `${this.shortId(playerId)} left the game.`
            }
        });
        
        this.notifyAll({
            type: 'list-rooms',
            args: Object.values(this.rooms)
        });
    }

    connectPlayer({ room, playerId, name }) {
        console.log(room);
        console.log(this.rooms);
        if(!this.rooms[room].players[playerId])
            this.instantiatePlayer(room, playerId, name);
        this.notifyRoom(room, {
            type: 'connect-player',
            args: {
                players: Object.values(this.rooms[room].players),
                drills: Object.values(this.rooms[room].cells)
            }
        });
        this.notifyRoom(room, {
            type: 'notification',
            args: {
                type: 'success',
                title: 'PLAYER',
                description: `${this.shortId(playerId)} joined the game.`
            }
        });

        this.notifyAll({
            type: 'list-rooms',
            args: Object.values(this.rooms)
        });
    }

    sendKey({playerId}) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        this.notify(playerId, {
            type: 'key',
            args: this.key
        });
    }

    movePlayer({ playerId, direction }) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        
        player.move(direction);

        this.notifyRoom(room,
            {
                type: 'move-player',
                args: {
                    playerId,
                    direction
                }
            }
        );
    }

    isCellFree(room, pos) {
        return !this.rooms[room].cells[pos];
    }

    placeDrill(room, x, y) {
        const pos = utils.position(x, y);
        if(!this.rooms[room].cells[pos])
            this.rooms[room].cells[pos] = new Cell({
                x,
                y
            });
        this.rooms[room].cells[pos].startDrill();
    }

    drill({ playerId }) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];

        const pos = utils.position(player.x, player.y);
        if(this.isCellFree(room, pos) && player.fuel >= this.drillCost) {
            player.updateFuel(player.fuel - this.drillCost);
            this.placeDrill(room, player.x, player.y);
            this.notifyRoom(room, {
                type: 'drill',
                args: {
                    playerId,
                    x: player.x,
                    y: player.y,
                    start: Date.now()
                }
            });
        }
    }

    collect({ playerId }) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        
        const pos = utils.position(player.x, player.y);
        if(this.rooms[room].cells[pos]) {
            this.rooms[room].cells[pos].collect(player);

            this.notifyRoom(room, {
                type: 'collect',
                args: {
                    playerId,
                    x: player.x,
                    y: player.y
                }
            });

            delete this.rooms[room].cells[pos];
        }
    }

    commit({playerId}) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];

        player.commit();
    }

    listRooms(socket, command) {
        this.notify(socket, {
            type: 'list-rooms',
            args: Object.values(this.rooms)
        });
    }

    createRoom(socket, command) {
        if(this.rooms[command.args.name]) {
            this.notify(socket, {
                type: 'notification',
                args: {
                    type: 'error',
                    title: 'ERROR',
                    description: 'ROom already exists'
                }
            });
            return;
        }

        this.rooms[command.args.name] = {
            name: command.args.name,
            players: {},
            maxPlayers: 8,
            cells: {},
            exclusive: command.args.exclusive,
            password: command.args.password
        }

        this.notify(socket, {
            type: 'create-room',
            args: this.rooms[command.args.name]
        });

        this.notifyAll({
            type: 'list-rooms',
            args: Object.values(this.rooms)
        });
    }

}
