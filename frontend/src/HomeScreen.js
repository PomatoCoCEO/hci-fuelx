class HomeScreen {

    constructor(game) {
        this.game = game;
    }

    getOptions() {
        return [
            {
                label: "Join Room",
                description: "Join a public or private room",
                handler: () => {
                    this.game.setScreen(this.game.screens.rooms);
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
        this.createElement();
        container.appendChild(this.element);
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions());
    }

}