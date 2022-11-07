class Game {

    constructor(config) {
        this.container = config.container;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        Object.values(this.gameObjects).forEach(object => { // update directions in each player
           object.update({
               direction: this.directionInput.direction
           });
        });

        Object.values(this.gameObjects).forEach(object => { // draw player animations
            object.sprite.draw(this.ctx);
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

        this.gameObjects = {
            'player': new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: true
            })
        }

        this.startGameLoop();
    }

}
