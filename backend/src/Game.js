import Cell from "./Cell.js";
import Player from "./Player.js";
import { utils } from "./utils.js";
import { io } from './index.js';

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
            name: name,
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

    connectPlayer({ room, playerId, name, socket }) {
        console.log(room);
        console.log(this.rooms);
        if(!this.rooms[room].players[playerId])
            this.instantiatePlayer(room, playerId, name, socket);
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
        // const player = this.rooms[room]. mplayers[playerId];
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
        console.log(" player is here ");
        let pos = {
            x: player.x,
            y: player.y
        };

        const directionUpdate = {
            'up': ['y', -64],
            'down': ['y', 64],
            'left': ['x', -64],
            'right': ['x', 64],
        };
        let [property, change] = directionUpdate[direction];
        pos[property] += change;
        console.log("position: ",pos);

        let playersInPos = Object.values(this.rooms[room].players).filter(p => p.x === pos.x && p.y === pos.y);
        console.log("length of players in pos is",playersInPos.length);
        console.log("Player positions: ");
        for(let p of Object.values(this.rooms[room].players)){
            console.log("(",p.x,",",p.y,")");
        }
        if(playersInPos.length < 2) {
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
            if(playersInPos.length === 1) { // THERE IS ANOTHER PLAYER
                let otherPlayer = playersInPos[0];
                console.log("sending interaction mode");
                io.to(otherPlayer.id).emit('interaction-mode',{});
                io.to(player.id).emit('interaction-mode',{});
            }
            if(playersInPos.length === 0) { // player alone in terrain cell
                io.to(player.id).emit('terrain-mode',{});
            }
        }

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

    attack({playerId}) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        const player2 = Object.values(this.rooms[room].players).find(p => p.x === player.x && p.y === player.y && p.id !== player.id);
        if(player2) {
            let sum_fuels = player.fuel + player2.fuel;
            let p1_ratio = player.fuel / sum_fuels;
            let spent_1 = Math.floor(player.fuel/2);
            let spent_2 = Math.floor(player2.fuel/2);
            let spent_sum = spent_1 + spent_2;
            if(Math.random() < p1_ratio) {
                player.updateFuel(Math.min(player.fuel - spent_1 + spent_sum/2,100));
                player2.updateFuel(Math.max(player2.fuel - spent_2,0));
            } else {
                player.updateFuel(Math.max(player.fuel - spent_1,0));
                player2.updateFuel(Math.floor(player2.fuel - spent_2 + spent_sum/2));
            }

        }
    }

    flee({playerId}) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        if(player.fuel < 25) return;
        const player2 = Object.values(this.rooms[room].players).find(p => p.x === player.x && p.y === player.y && p.id !== player.id);
        if(player2) {
            let directions = [ {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0} ];
            let dirNames = [ "up", "down","left", "right"];
            let pos = {x: player.x, y: player.y};
            for(let i = 0; i<3; i++) {
                let j;
                for(j = 1; j< 4; j++) {
                   let a = {x: pos.x + directions[i].x*j*64, y: pos.y + directions[i].y*j*64};
                   let noPlayersInCell = Object.values(this.rooms[room].players).filter(p => p.x === a.x && p.y === a.y).length;
                   if(noPlayersInCell<2) continue;
                   else break;
                } 
                if(j == 4) {
                    player.x = pos.x + directions[i].x*3*64;
                    player.y = pos.y + directions[i].y*3*64;
                    player.updateFuel(player.fuel - 25);
                    this.notifyRoom(room, {
                        type: 'flee-player',
                        args: {
                            playerId,
                            direction: dirNames[i]
                        }
                    });
                    break;
                }
                //! we need a RUN mode for this to work!
            }
        }
        

    }

    steal({playerId}) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        const player2 = Object.values(this.rooms[room].players).find(p => p.x === player.x && p.y === player.y && p.id !== player.id);
        if(player2 && player2.fuel > 25) {
            if(Math.random() < 0.25) {
                player2.updateFuel(player2.fuel - 25);
                player.updateFuel(Math.min(100,player.fuel + 25));
            }
        }
    }

    share({playerId}) {
        const room = this.playerRoom[playerId];
        if(!room)
            return;
        const player = this.rooms[room].players[playerId];
        const player2 = Object.values(this.rooms[room].players).find(p => p.x === player.x && p.y === player.y && p.id !== player.id);
        if(player2) {
            let fuel1 = player.fuel;
            let fuel2 = player2.fuel;
            let half = Math.floor((fuel1 + fuel2) / 2);
            player2.updateFuel(half);
            player.updateFuel(player.fuel - half);
        } // so this is the share part
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
