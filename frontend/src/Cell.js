class Cell extends GameObject {

    constructor(config) {
        super(config);
        this.maxFuel = 99;
        this.drillTime = 30; // In seconds
        this.progress = 0;
        this.startDrillTime = 0;
        this.occupied = false;
        this.children = [];
        this._hasTumbleweed = -1;
        this._hasCactus = -1;
        if(this.hasCactus) {
            this.children.push(new Cactus({
                x: this.x,
                y: this.y,
                game: this.game
            }));
            this.occupied = true;
        }
        if(this.hasTumbleweed) {
            this.children.push(new Tumbleweed({
                x: this.x,
                y: this.y,
                game: this.game
            }));
        }
    }

    update() {
        if(this.occupied == true && this.progress !== 1 && !this.hasCactus) {
            const diff = (Date.now() - this.startDrillTime) / 1000;
            this.progress = Math.min(1, diff / this.drillTime);
            if(this.progress === 1) {
                this.children.pop();
            }
        }
    }

    get val_hash() {
        let key = this.game.key;
        let pos_str = position(Math.floor(this.x), Math.floor(this.y));
        let hash = pos_str.hashCode();
        let val = (hash ^ key);
        if(val < 0) val = -val;
        return val;
    }

    get hasTumbleweed () {
        if(this._hasTumbleweed != -1) return this._hasTumbleweed == 1;
        let val = this.val_hash;
        let val_mod = val % 32;
        if(val_mod == 1) {
            this._hasTumbleweed = 1;
            return true;
        }
        this._hasTumbleweed = 0;
        return false;
    }

    get hasCactus () {
        if(this._hasCactus != -1)
            return this._hasCactus!=0;
        let v = this.val_hash;
        if(v % 16 == 15) {
            this._hasCactus = 1;
            return true;
        }
        else {
            this._hasCactus = 0;
            return false;
        }
    }

    startDrill(start) {
        this.occupied = true;
        this.startDrillTime = start;
        this.children = [
            new TerrainTile({
                x: this.x,
                y: this.y,
                game: this.game,
                cell: this
            }),
            new Drill({
                x: this.x,
                y: this.y,
                game: this.game
            })
        ]
    }

}