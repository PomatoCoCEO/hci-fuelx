class SocketHandler {

    constructor(config) {
        this.socket = io(config.connectString);
        this.game = config.game;
    }

    movePlayer(direction) {
        console.log('Move?');
        this.socket.emit('move-player', {
            playerId: this.socket.id,
            direction
        });
    }

    init() {
        this.socket.on('connect', () => {
            console.log(`Connected with id ${this.socket.id}`);

            this.socket.on('connect-player', (command) => {
                for(let player of command.args)
                    this.game.addPlayer(player);
            });

            this.socket.on('disconnect-player', (command) => {
                this.game.removePlayer(command.args);
            });

            this.socket.on('move-player', (command) => {
                this.game.movePlayer(command.args);
            });
        });

        return this.socket.id;
    }

}