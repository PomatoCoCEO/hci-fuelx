class Game {


    constructor(config) {
        this.container = config.container;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Object.values(this.gameObjects).forEach(object => { // update directions in each player
           if (object instanceof Player) {
               object.update({
                   direction: this.directionInput.direction
               });
           }
           else object.update();
        });
        let player = this.gameObjects[0];
        console.log(player.x);
        this.gameObjects.forEach(object => { // draw player animations
            object.sprite.draw(this.ctx, player);
        });
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
        this.ctx.fillStyle = '#fce899';
        this.ctx.fillRect(0,0,this.ctx.height, this.ctx.width);

        let decorations = [];
        for(let i = 0; i< 100; i++) {
            decorations.push(
                    new Cactus({
                        src: "static/images/cactus.png",
                        x: Math.floor(10*Math.random())*64,
                        y: Math.floor(10*Math.random())*64
                    }));
        }

        for(let i = 0; i<5; i++) {
            decorations.push(
                    new Tumbleweed({
                        src: "static/images/tumbleweed.png",
                        x: Math.floor(10*Math.random())*64,
                        y: Math.floor(10*Math.random())*64
                    }));
        }

        this.gameObjects = [
            new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: true
            }),
            new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: false,
                x:64,
                y:64
            }),
            ...decorations
        ]

        console.log("length of gameObjects: ",this.gameObjects.length);

        this.startGameLoop();
    }

}
