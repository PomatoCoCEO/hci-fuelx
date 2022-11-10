import Player from "./Player.js";

export default class Game {

    constructor() {
        this.observers = [];
        this.players = [];
    }

    playerIndex(playerId) {
        return this.players.findIndex(player => player.id === playerId);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    instantiatePlayer(playerId) {
        this.players.push(
            new Player(
                playerId,
                'Name...',
                0,
                0,
                'down'
            )
        );
    }

    subscribe(observerFunction) {
        this.observers.push(observerFunction);
    }

    notifyAll(command) {
        for(let observerFunction of this.observers)
            observerFunction(command);
    }

    disconnectPlayer(playerId) {
        this.removePlayer(playerId);
        this.notifyAll({
            type: 'disconnect-player',
            args: playerId
        });
    }

    connectPlayer(playerId) {
        if(this.playerIndex(playerId) === -1)
            this.instantiatePlayer(playerId);
        this.notifyAll({
            type: 'connect-player',
            args: this.players
        });
    }

    movePlayer({ playerId, direction }) {
        console.log(playerId, direction);
        let index = this.playerIndex(playerId);
        if(index === -1)
            return;
        
        this.players[index].move(direction);

        this.notifyAll({
            type: 'move-player',
            args: {
                playerId,
                direction
            }
        });
    }

}