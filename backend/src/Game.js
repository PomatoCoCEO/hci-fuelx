export default class Game {

    constructor() {
        this.observers = [];
        this.players = [];
    }

    subscribe(observerFunction) {
        this.observers.push(observerFunction);
    }

    notifyAll(command) {
        for(let observerFunction of this.observers)
            observerFunction(command);
    }

    disconnectPlayer(player) {
        this.players = this.players.filter(p => p.name !== player);
        this.notifyAll({
            type: 'disconnect-player',
            args: player
        });
    }

    connectPlayer(player) {
        if(this.players.indexOf(player) === -1)
            this.players.push({
                name: player,
                x: 0,
                y: 0
            });
        this.notifyAll({
            type: 'connect-player',
            args: this.players
        });
    }

    
    movePlayer(playerName, x, y, direction) {
        let index = this.players.findIndex(p => p.name === playerName);
        console.log(playerName, x, y, direction);
        this.players[index].x = x;
        this.players[index].x = y;
        this.notifyAll({
            type: 'move-player',
            args: {
                name: playerName,
                direction
            }
        });
    }

}