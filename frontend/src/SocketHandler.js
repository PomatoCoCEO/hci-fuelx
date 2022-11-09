class SocketHandler {

    constructor(config) {
        this.socket = io(config.connectString);
        this.game = config.game;
    }

    movePlayer(direction) {
        this.socket.emit('move-player', {
            name: this.socket.id,
            x: 0,
            y: 0,
            direction
        });
    }

    init() {
        this.socket.on('connect', () => {
            console.log(`Connected with id ${this.socket.id}`);

            this.socket.on('connect-player', (command) => {
                for(let player of command.args) {
                    this.game.addPlayer(player);
                }
            });

            this.socket.on('disconnect-player', (command) => {
                this.game.removePlayer(command.args);
            });

            this.socket.on('move-player', (command) => {
                this.game.movePlayer(command.args.name, command.args.direction);
            });
        });
    }

}