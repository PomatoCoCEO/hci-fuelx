import Cell from "./Cell.js";
import Player from "./Player.js";
import { utils } from "./utils.js";

export default class Room {

    constructor(notify) {
        this.rooms = {};
        this.observers = [];
        this.notify = notify;
    }
    
    shortId(playerId) {
        return (`${playerId}`).substring(0, 9);
    }
    
    subscribe(observerFunction) {
        this.observerFunction = observerFunction;
        this.observers.push(observerFunction);
    }

    notifyAll(command) {
        for(let observerFunction of this.observers)
            observerFunction(command);
    }

    list(socket, command) {
        this.notify(socket, {
            type: 'list-rooms',
            args: Object.values(this.rooms)
        });
    }

    create(socket, command) {
        if(this.rooms[command.args.name]) {
            this.notify(socket, {
                type: 'notification',
                args: {
                    type: 'error',
                    title: 'ERROR',
                    description: 'Room already exists'
                }
            })
            return;
        }

        this.rooms[command.args.name] = command.args;

        this.notify(socket, {
            type: 'create-room',
            args: command.args.name
        });

        this.notifyAll({
            type: 'list-rooms',
            args: Object.values(this.rooms)
        });
    }

}
