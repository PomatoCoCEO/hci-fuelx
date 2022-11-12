class NetworkPlayers {

    constructor(map) {
        this.map = map;
    }

    movePlayer({ playerId, direction }) {
        if(playerId === this.map.id)
            return;
        this.map.gameObjects.players[playerId].forceUpdate({
            direction
        });
    }

    addPlayer(player) {
        console.log(player);
        if(!this.map.gameObjects.players[player.id]) {
            this.map.gameObjects.players[player.id] = new Player({
                id: player.id,
                src: 'static/images/player.png',
                name: player.name,
                isPlayerControlled: player.id === this.map.id,
                x: player.x,
                y: player.y,
                game: this.map.game
            });
        }
    }

    removePlayer(playerId) {
        if(this.map.gameObjects.players[playerId]) {
            this.map.gameObjects.players[playerId].clean();
            delete this.map.gameObjects.players[playerId];
        }
    }

    updateFuel({ playerId, fuel }) {
        this.map.gameObjects.players[playerId].fuel = fuel;
        if(playerId === this.map.id)
            this.map.game.healthBar.update(fuel);
    }
}
