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
        let player = this.gameObjects.player;
        console.log(player.x);
        Object.values(this.gameObjects).forEach(object => { // draw player animations
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

        this.gameObjects = {
            player: new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: true
            }),


            player1: new Player({
                src: 'static/images/player.png',
                name: 'Player',
                isPlayerControlled: false,
                x:64,
                y:64
            }),


        }

        this.startGameLoop();
    }

}
