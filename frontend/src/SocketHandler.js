class SocketHandler {

    constructor(config) {
        this.connectString = config.connectString;
        this.game = config.game;
        this.map = config.map;
    }

    listRooms() {
        console.log('list-rooms');
        this.socket.emit('create-room', {
            args: {
                name: 'a',
                players: 0,
                limitPlayers: 16
            }
        });
        this.socket.emit('list-rooms', {});
    }

    movePlayer(direction) {
        this.socket.emit('move-player', {
            playerId: this.socket.id,
            direction
        });
    }

    drill() {
        this.socket.emit('drill', {
            playerId: this.socket.id
        });
    }

    collect() {
        this.socket.emit('collect', {
            playerId: this.socket.id
        });
    }

    async init() {
        this.socket = io(this.connectString);
        await this.socket.on('connect', () => {
            console.log(`Connected with id ${this.socket.id}`);

            this.socket.on('connect-player', (command) => {
                for(let player of command.args.players)
                    this.map.networkPlayers.addPlayer(player);
                for(let drill of command.args.drills) {
                    this.map.placeDrill(drill);
                }
            });

            this.socket.on('disconnect-player', (command) => {
                this.map.networkPlayers.removePlayer(command.args);
            });

            this.socket.on('move-player', (command) => {
                this.map.networkPlayers.movePlayer(command.args);
            });

            this.socket.on('fuel-update', (command) => {
                this.map.networkPlayers.updateFuel(command.args);
            });

            this.socket.on('drill', (command) => {
                this.map.placeDrill(command.args);
            });

            this.socket.on('collect', (command) => {
                this.map.removeDrill(command.args);
            });

            this.socket.on('notification', (command) => {
                this.map.game.addNotification(command.args);
            });

            this.socket.on('list-rooms', (command) => {
                if(this.game.screen === this.game.screens.rooms) {
                    this.game.screen.update(command.args);
                }
            });
        });
    }

}