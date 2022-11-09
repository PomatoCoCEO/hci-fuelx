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
        Object.values(this.gameObjects).forEach(object => { // update directions in each player
           object.update();
        });
        Object.values(this.players).forEach(player => {
            player.update({
                direction: this.directionInput.direction,
                action: this.actionInput.action
            });
            player.drills.forEach(drill => {
                drill.updateAnimationProgress();
            });
        });

        let player = this.players[0];
        this.gameObjects.forEach(object => { // draw player animations
            object.sprite.draw(this.ctx, player);
        });
        this.players.forEach(object => {
            object.sprite.draw(this.ctx, player);
            object.drills.forEach(drill => {
                drill.sprite.draw(this.ctx, player);
            })
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

    movePlayer(name, direction) {
        if(name === this.socketHandler.socket.id)
            return;
        const index = this.players.findIndex(player => player.name === name);
        console.log('MOVE: ', name, direction, index);
        this.players[index].forceUpdate({
            direction
        });
    }

    addPlayer({name, x, y}) {
        console.log('ADD: ' + name);
        if(name === this.socketHandler.socket.id)
            return;
        const index = this.players.findIndex(player => player.name === name);
        console.log(this.players, name);
        console.log(index);

        if(index === -1) {
            this.players.push(
                new Player({
                    src: 'static/images/player.png',
                    name,
                    isPlayerControlled: false,
                    x,
                    y,
                    game: this
                })
            );
        }
        console.log(this.players);
    }

    removePlayer(playerName) {

    }

    init() {
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.socketHandler = new SocketHandler({
            connectString: "ws://localhost:4000",
            game: this
        });
        this.socketHandler.init();
        this.actionInput = new ActionInput();
        this.actionInput.init();
        this.ctx.fillStyle = '#fce899';
        this.ctx.fillRect(0,0,this.ctx.height, this.ctx.width);

        let decorations = [];
        for(let i = 0; i< 100; i++) {
            decorations.push(
                    new Cactus({
                        src: "static/images/cactus.png",
                        x: Math.floor(10*Math.random())*64,
                        y: Math.floor(10*Math.random())*64,
                        game: this
                    }));
        }

        for(let i = 0; i<5; i++) {
            decorations.push(
                    new Tumbleweed({
                        src: "static/images/tumbleweed.png",
                        x: Math.floor(10*Math.random())*64,
                        y: Math.floor(10*Math.random())*64,
                        game: this
                    }));
        }

        this.players = [
            new Player({
                src: 'static/images/player.png',
                name: this.socketHandler.socket.id,
                isPlayerControlled: true,
                game: this
            })
        ]

        this.gameObjects = [
            ...decorations
        ]

        console.log("length of gameObjects: ", this.gameObjects.length);
        this.startGameLoop();
    }

}
