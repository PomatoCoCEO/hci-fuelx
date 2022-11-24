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
            <p class="create-room-field">Room name:</p>
            <input type="text" class="create-room-input">
                <p class="create-room-field">Private?</p>
                <input class="create-room-private" type="checkbox">
                <button class="create-room-btn">CREATE ROOM</button>
            </div>
        `);
        this.element.querySelector('.go-back').addEventListener('click', () => {
            this.game.setScreen(this.game.screens.home);
        });

        this.element.querySelector('.create-room-btn').addEventListener('click', () => {
            this.game.socketHandler.createRoom(this.element.querySelector('.create-room-input').value, this.element.querySelector('.create-room-private').checked);
            this.game.setScreen(this.game.screens.rooms);
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