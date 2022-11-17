import Cell from "./Cell.js";
import Player from "./Player.js";
import { utils } from "./utils.js";

export default class Game {

    constructor() {
        this.observers = [];
        this.players = {};
        this.cells = {};
        this.drillCost = 33;
    }

    instantiatePlayer(playerId) {
        this.players[playerId] = new Player({
            id: playerId,
            name: 'Name...',
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
        delete this.players[playerId];
        this.notifyAll({
            type: 'disconnect-player',
            args: playerId
        });
        /*this.notifyAll({
            type: 'notification',
            args: {
                type: 'error',
                title: 'PLAYER',
                description: `${this.shortId(playerId)} left the game.`
            }
        });*/
    }

    connectPlayer(playerId) {
        if(!this.players[playerId])
            this.instantiatePlayer(playerId);
        /*this.notifyAll({
            type: 'connect-player',
            args: {
                players: Object.values(this.players),
                drills: Object.values(this.cells)
            }
        });
        this.notifyAll({
            type: 'notification',
            args: {
                type: 'success',
                title: 'PLAYER',
                description: `${this.shortId(playerId)} joined the game.`
            }
        });*/
    }

    movePlayer({ playerId, direction }) {
        const player = this.players[playerId];
        if(!player)
            return;
        
        player.move(direction);

        this.notifyAll({
            type: 'move-player',
            args: {
                playerId,
                direction
            }
        });
    }

    isCellFree(pos) {
        return !this.cells[pos];
    }

    placeDrill(x, y) {
        const pos = utils.position(x, y);
        if(!this.cells[pos])
            this.cells[pos] = new Cell({
                x,
                y
            });
        this.cells[pos].startDrill();
    }

    drill({ playerId }) {
        const player = this.players[playerId];
        if(!player)
            return;

        const pos = utils.position(player.x, player.y);
        if(this.isCellFree(pos) && player.fuel >= this.drillCost) {
            player.updateFuel(player.fuel - this.drillCost);
            this.placeDrill(player.x, player.y);
            this.notifyAll({
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
        const player = this.players[playerId];
        if(!player)
            return;
        
        const pos = utils.position(player.x, player.y);
        if(this.cells[pos]) {
            this.cells[pos].collect(player);

            this.notifyAll({
                type: 'collect',
                args: {
                    playerId,
                    x: player.x,
                    y: player.y
                }
            });

            delete this.cells[pos];
        }
    }
}
