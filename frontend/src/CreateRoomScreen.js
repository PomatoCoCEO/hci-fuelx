class CreateRoomScreen {

    constructor(game) {
        this.game = game;
        this.rooms = [
            {
                id: 'awd21',
                name: 'Teste',
                protected: false,
                players: 2,
                limitPlayers: 16
            },
            {
                id: 'a31dmaw',
                name: 'Samuel',
                protected: true,
                players: 5,
                limitPlayers: 16
            }
        ]
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("rooms-screen");
    }

    close() {
        this.element.remove();
    }

    init(container) {
    }

}