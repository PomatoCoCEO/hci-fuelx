class Game {

    constructor(config) {
        this.container = config.container;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.player = new Player({
            src: 'static/images/player.png',
            name: 'Bruh'
        });

        this.player.sprite.setAnimation('walk-down');
    }

    gameLoop() {
        // this.ctx.clearRect(0, 0, this.canvas.weight, this.canvas.height);
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#333";
        this.ctx.fill();

        this.player.sprite.draw(this.ctx);
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
        console.log("goodbye bruh world");

        this.startGameLoop();
    }

}
