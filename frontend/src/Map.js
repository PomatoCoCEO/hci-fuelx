class Map {

    constructor(game) {
        this.game = game;
        this.gameObjects = {};
        this.drillCost = 10;
    }

    get id() {
        return this.game.socketHandler.socket.id;
    }

    get camera() {
        return this.gameObjects.players[this.id];
    }

    draw() {
        if(this.camera) {
            Object.values(this.gameObjects).forEach(objects => {
                Object.values(objects).forEach(object => {
                    if(object.children) {
                        Object.values(object.children).forEach(child => {
                            child.update();
                        });
                    }
                    object.update({
                        direction: this.game.directionInput.direction
                    });
                    object.updatePending();
                });
            });

            Object.values(this.gameObjects).forEach(objects => {
                Object.values(objects).forEach(object => {
                    if(object.children) {
                        Object.values(object.children).forEach(child => {
                            child.sprite.draw(this.game.ctx, this.camera);
                        });
                    }
                    object.sprite.draw(this.game.ctx, this.camera);
                });
            });
        }
    }

    init() {
        this.networkPlayers = new NetworkPlayers(this);
        this.gameObjects = {
            cells: {},
            decorations: {},
            players: {}
        }
    }

    placeDrill({ x, y, start }) {
        const pos = position(x, y);
        if(!this.gameObjects.cells[pos]) {
            this.gameObjects.cells[pos] = new Cell({
                x,
                y,
                game: this.game
            });
        }
        const cell = this.gameObjects.cells[pos];
        cell.startDrill(start);
    }

    removeDrill({ x, y }) {
        delete this.gameObjects.cells[position(x, y)];
    }

}
