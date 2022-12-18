class CostumizeScreen {

    constructor(game) {
        this.game = game;
        this.skins = ['player_orange.png', 'player_green.png', 'player_blue.png', 'player_purple.png', 'player_red.png', 'player_yellow.png'];
        this.skin = 0;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("create-room-screen");
        this.element.innerHTML = (`
            <button class="go-back"></button>
            <div class="create-room">
            <p class="create-room-field">Car skin:</p>
            <div class="skin">
                <button class="skin-button rotate-left">
                </button>
                <div class="skin-player"></div>
                <button class="skin-button rotate-right">
                </button>
            </div>
            <button class="create-room-btn">Join Room</button>
            </div>
        `);
        this.updateSkin();

        this.element.querySelector('.go-back').addEventListener('click', () => {
            this.game.setScreen(this.game.screens.rooms);
        });

        this.element.querySelector('.rotate-right').addEventListener('click', () => {
            this.skin = (this.skin + 1) % this.skins.length;
            this.updateSkin();
        });

        this.element.querySelector('.rotate-left').addEventListener('click', () => {
            this.skin = ((this.skin - 1) % this.skins.length + this.skins.length) % this.skins.length;
            this.updateSkin();
        });

        this.element.querySelector('.create-room-btn').addEventListener('click', () => {
            this.game.socketHandler.joinRoom(this.room, 'ColdAtom', this.skins[this.skin]);
            this.game.startGame();
        });
    }

    updateSkin() {
        this.element.querySelector('.skin-player').style.backgroundImage = `url("static/images/${this.skins[this.skin]}")`;
    }

    setRoom(room) {
        this.room = room;
    }

    close() {
        this.element.remove();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}