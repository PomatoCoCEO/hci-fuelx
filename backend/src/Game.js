export default class Game {

    constructor() {
        this.observers = [];
    }

    subscribe(observerFunction) {
        this.observers.push(observerFunction);
    }

    notifyAll(command) {
        for(let observerFunction of this.observers)
            observerFunction(command);
    }

    disconnectPlayer(player) {
        this.notifyAll({
            type: 'disonnect-player',
            args: player
        });
    }

}