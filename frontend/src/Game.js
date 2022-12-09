class Game {

    constructor(config) {
        this.container = config.container;
        this.overlay = config.overlay;
        this.notifications = config.notifications;
        
        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.ctx.canvas.style.width  = `${window.innerWidth}px`;
        this.ctx.canvas.style.height = `${window.innerWidth*3/4}px`;
        this.ctx.imageSmoothingEnabled = false;
    }

    setFullScreen() {
        if (this.container.requestFullscreen) {
            this.container.requestFullscreen();
        } else if (this.container.webkitRequestFullscreen) { /* Safari */
            this.container.webkitRequestFullscreen();
        } else if (this.container.msRequestFullscreen) { /* IE11 */
            this.container.msRequestFullscreen();
        }
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

    setScreen(screen) {
        if(this.screen)
            this.screen.close();
        this.screen = screen;
        this.screen.init(this.overlay);
        this.setFullScreen();
    }

    async startGame() {
        if(this.screen)
            this.screen.close();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        
        this.healthBar = new HealthBar(this.overlay);
        this.healthBar.init();
        this.timeCounter = new TimeCounter(this.overlay);
        this.timeCounter.init();
        this.jerrycanOverlay = new JerrycanOverlay({
            overlay: this.overlay,
            game: this,
        });
        this.actionMenu = new ActionMenu({
            overlay: this.overlay,
            options: [
                {
                    class: 'collect_button',
                    handler: () => this.socketHandler.collect()
                },
                {
                    class: 'drill_button',
                    handler: () => this.socketHandler.drill()
                },
                {
                    class: 'trade_button',
                    handler: () => {
                        // console.log('trade');
                        this.socketHandler.commit();
                    }
                }
            ]
        });
        this.actionMenu.init();

        this.moveMenu = new MovementMenu({
            overlay: this.overlay,
            options: [
                {
                    class: 'move-up',
                    handler: () => this.map.camera.update({
                        direction: 'up'
                    })
                },
                {
                    class: 'move-down',
                    handler: () => this.map.camera.update({
                        direction: 'down'
                    })
                },
                {
                    class: 'move-left',
                    handler: () => this.map.camera.update({
                        direction: 'left'
                    })
                },
                {
                    class: 'move-right',
                    handler: () => this.map.camera.update({
                        direction: 'right'
                    })
                }
            ]
        });
        this.moveMenu.init();


        new KeyPressListener("KeyV", () => this.socketHandler.drill());
        new KeyPressListener("KeyC", () => this.socketHandler.collect());
        new KeyPressListener("KeyX", () => this.socketHandler.commit());

        this.startGameLoop();
    }

    async init() {
        this.map = new Map(this);
        this.map.init();
        this.socketHandler = new SocketHandler({
            connectString: "ws://atomicbits.pt:8080",// atomicbits.pt",
            map: this.map,
            game: this
        });
        
        await this.socketHandler.init();

        this.screens = {
            rooms: new RoomListScreen(this),
            home: new HomeScreen(this),
            createRoom: new CreateRoomScreen(this)
        }

        this.setScreen(this.screens.home);
    }

}
