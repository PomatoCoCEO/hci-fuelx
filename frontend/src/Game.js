class Game {

    constructor(config) {
        this.timer = document.getElementById("timer");
        this.begin_time = new Date().getTime();
        this.container = config.container;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.socket = io('localhost:4000');
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
           if (object instanceof Player) {
               object.update({
                    direction: this.directionInput.direction,
                    action: this.actionInput.action
               });
               object.drills.forEach(drill => {
                    drill.updateAnimationProgress();
                });
           }
           else object.update();
        });
        let player = this.gameObjects[0];
        // console.log(player.x);
        this.gameObjects.forEach(object => { // draw player animations
            object.sprite.draw(this.ctx, player);
            if (object instanceof Player) {
                object.drills.forEach(drill => {
                    console.log("drill in x ",drill.x,"and y ", drill.y );
                    drill.sprite.draw(this.ctx, player);
                });
            }
        });
    }
    

    isCellAvailable(x, y) {
        if (this.gameObjects.some(object => {
            return (!(object instanceof Player) && object.x ===x && object.y === y);
        })) return false;
        else {
            for(const element of this.gameObjects) {
                if (element instanceof Player) {
                    for(const drill of element.drills) {
                        if (drill.x === x && drill.y === y) return false;
                    }
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

    init() {
        this.directionInput = new DirectionInput();
        this.directionInput.init();
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

        this.gameObjects = [
            new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: true,
                game: this
            }),
            new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: false,
                x:64,
                y:64,
                game: this
            }),
            ...decorations
        ]

        console.log("length of gameObjects: ",this.gameObjects.length);

        this.startGameLoop();
    }

}
