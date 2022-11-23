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
        if(!this.map.gameObjects.players[player.id]) {
            this.map.gameObjects.players[player.id] = new Player({
                id: player.id,
                src: 'static/images/player.png',
                name: player.name,
                isPlayerControlled: player.id === this.map.id,
                x: player.x,
                y: player.y,
                game: this.map.game,
                fuel: player.fuel,
                jerrycans: player.jerrycans
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

    updateJerrycans({ playerId, fuel, jerrycans }) {
        this.map.gameObjects.players[playerId].fuel = fuel; // do you really want this?
        this.map.gameObjects.players[playerId].updateJerrycans({jerrycans:jerrycans});
    }
}
