class Map {

    constructor(game) {
        this.game = game;
        this.gameObjects = {};
        this.calculated = {};
        this.drillCost = 10;
        this.floorImage = new Image();
        this.floorImage.src = 'static/images/noise.png';
        this.floorImage.onload = () => {
            // this.drawFloor();
        }
    }

    get id() {
        return this.game.socketHandler.socket.id;
    }

    get camera() {
        return this.gameObjects.players[this.id];
    }

    drawFloor() {
        let dim = 32, dim_final = 64;
        for(let i = -6; i<6; i++) {
            for(let j = -4; j<=4; j++) {
                let x = this.camera.x - this.camera.x % 64 + 64*i;
                let y = this.camera.y - this.camera.y % 64 + 64*j;
                this.game.ctx.drawImage(this.floorImage,
                    0, 0,
                    dim, dim,
                    (x - this.camera.x)+3*64, (y - this.camera.y)+2*64,
                    dim_final, dim_final
                );
            }
        }

    }

    draw() {
        this.getDecorations();
        if(this.camera) {
            this.drawFloor();
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

    getDecorations() {
        if (this.camera) {
            let x_pos = this.camera.x - this.camera.x % 64;
            let y_pos = this.camera.y - this.camera.y % 64;
            let ps = position(x_pos, y_pos);
            if(this.calculated[ps]) return;
            for(let i = -4; i<=4; i++) {
                for(let j = -4; j<=4; j++) {
                    let x = x_pos + 64*i;
                    let y = y_pos + 64*j;
                    const pos = position(x, y);
                    let hash = pos.hashCode() ^ this.game.key;
                    if(hash < 0) hash = - hash;
                    let f = this.gameObjects.decorations[pos];
                    if(f) continue;
                    if((hash % 16)%8 == 7) {
                        this.gameObjects.decorations[pos]=new Cactus({
                            x:x,
                            y:y,
                            game:this.game
                        });
                    }
                    if(hash % 32 == 31) {
                        this.gameObjects.decorations[pos]=new Tumbleweed({
                            x:x,
                            y:y,
                            game:this.game
                        });
                    }
                }
            }
            this.calculated[ps] = true;
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
        let obj = this.gameObjects.decorations[pos];
        if(obj && obj instanceof Cactus) return; // there is a cactus here, no drill here!
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
