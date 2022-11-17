class CreateRoomScreen {

    constructor(game) {
        this.game = game;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("create-room-screen");
        this.element.innerHTML = (`
            <button class="go-back"></button>
            <div class="create-room">
                <input type="text" class="create-room-input">
                <button class="create-room-btn">CREATE ROOM</button>
            </div>
        `);
        this.element.querySelector('.go-back').addEventListener('click', () => {
            this.game.setScreen(this.game.screens.home);
        });

        this.element.querySelector('.create-room-btn').addEventListener('click', () => {
            this.game.socketHandler.createRoom(this.element.querySelector('.create-room-input').value);
        });
    }

    close() {
        this.element.remove();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}