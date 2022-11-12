class Game {

    constructor(config) {
        this.container = config.container;
        this.overlay = config.overlay;
        this.notifications = config.notifications;
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.timeCounter.update();
        this.map.draw();
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

    addNotification(config) {
        new Notification({
            overlay: this.notifications,
            type: config.type,
            title: config.title,
            description: config.description
        }).createElement();
    }

    async init() {
        this.map = new Map(this);
        this.map.init();

        this.homeScreen = new HomeScreen();
        await this.homeScreen.init(this.overlay);
        
        this.socketHandler = new SocketHandler({
            connectString: "ws://localhost:8080",
            map: this.map,
            game: this
        });
        
        await this.socketHandler.init();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        
        this.healthBar = new HealthBar(this.overlay);
        this.healthBar.init();
        this.timeCounter = new TimeCounter(this.overlay);
        this.timeCounter.init();


        new KeyPressListener("KeyV", () => this.socketHandler.drill());
        new KeyPressListener("KeyC", () => this.socketHandler.collect());

        new KeyPressListener("KeyX", () => this.map.camera.update({
            action: 'commit-to-jerrycans'
        }));

        this.startGameLoop();
    }

}
