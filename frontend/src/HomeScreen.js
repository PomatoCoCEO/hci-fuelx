class HomeScreen {

    constructor(game) {
        this.game = game;
    }

    getOptions(resolve) {
        return [
            {
                label: "Join Room",
                description: "Join a public or private room",
                handler: () => {
                    this.game.setFullScreen();
                    this.close();
                    resolve();
                }
            },
            {
                label: "Create Room",
                description: "Create a public or private room",
                handler: () => {
                    
                }
            }
        ]
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("HomeScreen");
        this.element.innerHTML = (`
            <h1 class="title">FuelX</h1>
        `);
    }

    close() {
        this.element.remove();
    }

    init(container) {
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            this.keyboardMenu = new KeyboardMenu();
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setOptions(this.getOptions(resolve));
        });
    }

}