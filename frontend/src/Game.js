class Game {

    constructor(config) {
        this.timer = document.getElementById("timer");
        this.begin_time = new Date().getTime();
        this.container = config.container;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }

    updateTimer() {
        var now = new Date().getTime();

        var dif = this.begin_time - now;

        var minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60))+10;
        var seconds = Math.floor((dif % (1000 * 60)) / 1000)+60;

        if(seconds < 10) {
            this.timer.innerHTML = minutes.toString() + ":0" + seconds.toString();
        }else {
            this.timer.innerHTML = minutes.toString() + ":" + seconds.toString();
        }
    }

    gameLoop() {
        this.updateTimer();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        Object.values(this.gameObjects).forEach(objects => {
            for(let object of objects) {
                object.update({
                    direction: this.directionInput.direction,
                    action: this.actionInput.action
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
        if (this.gameObjects.some(object => {
            return (!(object instanceof Player) && object.x ===x && object.y === y);
        })) return false;
        else {
            for(const element of this.players) {
                for(const drill of element.drills) {
                    if (drill.x === x && drill.y === y) return false;
                }
            }
            return true;
        }
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
        console.log(playerId, direction)
        if(playerId === this.socketHandler.socket.id)
            return;
        console.log(this.gameObjects);
        const index = this.playerIndex(playerId);
        console.log('MOVE: ', playerId, direction, index);
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
        console.log(this.gameObjects.players);
    }

    init() {
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.actionInput = new ActionInput();
        this.actionInput.init();
        this.socketHandler = new SocketHandler({
            connectString: "ws://localhost:4000",
            game: this
        });

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

        this.startGameLoop();
    }

}
