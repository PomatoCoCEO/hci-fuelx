class SocketHandler {

    constructor(config) {
        this.connectString = config.connectString;
        this.game = config.game;
        this.map = config.map;
    }

    listRooms() {
        this.socket.emit('list-rooms', {});
    }

    createRoom(room, flag) {
        console.log(flag);
        this.socket.emit('create-room', {
            args: {
                name: room,
                exclusive: flag,
                password: 'teste'
            }
        });
    }

    joinRoom(room, name) {
        this.socket.emit('connect-player', {
            args: {
                room,
                playerId: this.socket.id,
                name
            }
        })
    }

    movePlayer(direction) {
        console.log("emitting move-player");
        this.socket.emit('move-player', {
            playerId: this.socket.id,
            direction: direction
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

    commit() {
        this.socket.emit("commit", {
            playerId: this.socket.id
            });
    }

    /// now let us program the interactions between players

    attack() {
        this.socket.emit("attack", {
            playerId: this.socket.id
        });
    }

    share() {
        this.socket.emit("share", {
            playerId: this.socket.id
        });
    }

    flee() {
        this.socket.emit("flee", {
            playerId: this.socket.id
        });
    }

    steal() {
        this.socket.emit("steal", {
            playerId: this.socket.id
        })
    }



    async init() {
        this.socket = io(this.connectString);
        await this.socket.on('connect', () => {
            console.log(`Connected with id ${this.socket.id}`);
            this.socket.on("key", (command) => {
                this.game.key = command.args;
            });

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

            this.socket.on('jerrycan-update', (command) => {
                this.map.networkPlayers.updateJerrycans(command.args);
            })

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
            
            this.socket.on('jerrycan-update', ({playerId, jerrycans})=>{
                console.log("jerrycan-update");
                let p= this.map.gameObjects.players[playerId];
                if(p)
                    p.updateJerrycans({jerrycans:jerrycans});
            })

            this.socket.on('flee-player', (command)=>{
                this.map.networkPlayers.fleePlayer(command.args);
            });

            this.socket.on('interaction-mode', () => {
                console.log("entering interaction mode...");
                this.game.actionMenu.alterOptions(
                    [
                        {
                            class: 'flee_button',
                            handler: () => this.flee() 
                            // talvez precisemos de mais especificacoes aqui
                        },
                        {
                            class: 'attack_button',
                            handler: () => this.attack()
                        },
                        {
                            class: 'steal_button',
                            handler: () => {
                                // console.log('trade');
                                this.steal();
                            }
                        },
                        {
                            class: 'share_button',
                            handler: () => {
                                // console.log('trade');
                                this.share();
                            }
                        }
                        
                    ]
                );
            } );

            this.socket.on('terrain-mode', () => {
                this.game.actionMenu.alterOptions(
                    [
                        {
                            class: 'collect_button',
                            handler: () => this.collect()
                        },
                        {
                            class: 'drill_button',
                            handler: () => this.drill()
                        },
                        {
                            class: 'trade_button',
                            handler: () => {
                                // console.log('trade');
                                this.commit();
                            }
                        }
                    ]
                );
            } );
        });
    }

}