class RoomListScreen {

    constructor(game) {
        this.game = game;
        this.rooms = []
    }

    createRooms() {
        if(this.roomsElement)
            this.roomsElement.remove();
        this.roomsElement = document.createElement('div');
        this.roomsElement.classList.add('rooms-list');
        for(let room of this.rooms) {
            console.log(room);
            let roomElement = document.createElement('div');
            roomElement.classList.add('room');
            roomElement.setAttribute('data-id', room.name);
            roomElement.innerHTML = (`
                <div class="room-name">
                    ${
                        room.exclusive ? '<img class="room-locker" src="static/images/locker.png"/>': ''
                    }
                    <p>Room: #${room.name}</p>
                </div>
                <div class="room-players">
                    <p>${Object.values(room.players).length}/${room.maxPlayers}</p>
                </div>
            `);
            this.roomsElement.appendChild(roomElement);
        }
        this.element.appendChild(this.roomsElement);

        this.element.querySelectorAll('.room').forEach(roomElement => {
            roomElement.addEventListener('click', () => {
                this.game.socketHandler.joinRoom(roomElement.dataset.id, 'ColdAtom');
                this.game.startGame();
            });
        });
    }

    update(rooms) {
        this.rooms = rooms;
        this.createRooms();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("rooms-screen");
        this.element.innerHTML = (`
            <button class="go-back"></button>
        `);
        this.game.socketHandler.listRooms();
        this.element.querySelectorAll('.go-back').forEach(button => {
            button.addEventListener('click', () => {
                this.game.setScreen(this.game.screens.home);
            });
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