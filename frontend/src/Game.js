class Game {

    constructor(config) {
        this.container = config.container;
        this.overlay = config.overlay;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }

    gameLoop() {
        this.timeCounter.update();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        Object.values(this.gameObjects).forEach(objects => {
            for(let object of objects) {
                object.update({
                    direction: this.directionInput.direction
                });
                object.updatePending();
            }
        })

        let camera = this.gameObjects.players[0];

        Object.values(this.gameObjects).forEach(objects => {
            for(let object of objects) {
                object.sprite.draw(this.ctx, camera);
            }
        });
    }
    

    isCellAvailable(x, y) {
        return true;
    }

    startGameLoop() {
        const frame = () => {
            this.gameLoop();

            requestAnimationFrame(() => {
                frame();
            });
        }

        frame();
    }

    movePlayer({ playerId, direction }) {
        if(playerId === this.socketHandler.socket.id)
            return;
        const index = this.playerIndex(playerId);
        this.gameObjects.players[index].forceUpdate({
            direction
        });
    }

    playerIndex(playerId) {
        return this.gameObjects.players.findIndex(player => player.id === playerId);
    }

    addPlayer(player) {
        if(player.id === this.socketHandler.socket.id) {
            this.gameObjects.players[0].id = this.socketHandler.socket.id;
            return;
        }
        const index = this.playerIndex(player.id);

        if(index === -1) {
            this.gameObjects.players.push(
                new Player({
                    id: player.id,
                    src: 'static/images/player.png',
                    name: player.name,
                    isPlayerControlled: false,
                    x: player.x,
                    y: player.y,
                    game: this
                })
            );
        }
    }

    removePlayer(playerId) {
        const index = this.playerIndex(playerId);
        if(index !== -1) {
            this.gameObjects.players[index].element.remove();
        }
        this.gameObjects.players = this.gameObjects.players.filter(player => player.id !== playerId);
    }

    async init() {
        this.homeScreen = new HomeScreen();
        await this.homeScreen.init(this.overlay);
        
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.socketHandler = new SocketHandler({
            connectString: "ws://localhost:4000",
            game: this
        });
        
        this.healthBar = new HealthBar(this.overlay);
        this.healthBar.init();
        this.timeCounter = new TimeCounter(this.overlay);
        this.timeCounter.init();

        this.gameObjects = {
            players: [
                new Player({
                    id: this.socketHandler.init(),
                    src: 'static/images/player.png',
                    name: 'PLAYER_NAME',
                    isPlayerControlled: true,
                    game: this
                })
            ],
            decorations: []
        }

        new KeyPressListener("KeyV", () => this.gameObjects.players[0].update({
            action: 'drill'
        }));

        this.startGameLoop();
    }

}
