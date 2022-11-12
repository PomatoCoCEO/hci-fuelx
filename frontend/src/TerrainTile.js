class TerrainTile extends GameObject {
    constructor (config) {
        super(config);
        this.sprite = new TerrainTileSprite({
            src: config.src || undefined,
            gameObject: this
        });
        this.fl = -1;
        this.max_fl = -1;
        this._val_hash = this.val_hash;
        this._hasCactus = -1;
        this._hasCactus = this.hasCactus;

        this._hasTumbleweed = -1;
        this._hasTumbleweed = this.hasTumbleweed;
        console.log(`${this.x} ${this.y} ${this._val_hash} ${this._val_hash % 16} ${this._val_hash % 64} ${this._hasTumbleweed}`);
        if(this.hasCactus) {
            this.cactus = new Cactus({
                x: this.x,
                y: this.y,
                gameObject: this
            });
        }
        if(this.hasTumbleweed) {
            this.tumbleweed = new Tumbleweed({
                x: this.x,
                y: this.y,
                gameObject: this
            });
        }
        // this.fuelLevel = config.fuelLevel || 0;
        // this.hasDrill = false;
    }

    get val_hash() {
        let key = this.game.key;
        let pos_str = pos_to_string(Math.floor(this.x), Math.floor(this.y));
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

    get fuelLevel() {
        if(this.fl != -1)
            return this.fl;
        // if this.game.hasCached(this.x, this.y) return this.game.getCached(this.x, this.y);
        let val = this.val_hash;
        if (val % 4 == 0) {
            this.fl = (val % 400) /4;
            if(this.fl < 0) this.fl = -this.fl;
            this.max_fl = this.fl;
            return this.fl;
        }
        this.fl = 0;
        this.max_fl = 0;
        return this.fl;
        // return this.fuelLevel;
    }

    decreaseFuel(quant) {
        let to_subtract = Math.min(quant, this.fl);
        this.fl -= to_subtract ;
        return to_subtract;
    }

    regenerate() {
        let reg_quant = Math.min(1, this.max_fl - this.fl);
        this.fl += reg_quant;
        return reg_quant;
    }

    color() {
        let f = this.fuelLevel;
        // colors defined in the gradient: light yellow
        let fuel_zero = [parseInt("ff", 16), parseInt("fd", 16), parseInt("76", 16)];
        // let fuel_50 = parseInt("ff8800", 16);  // orange
        let fuel_50 = [parseInt("ff", 16), parseInt("88", 16), parseInt("00", 16)];
        let fuel_max = [parseInt("6f", 16), parseInt("3f", 16), parseInt("00", 16)];
        let val_color = [];
        if ( f < 50) {
            let perc = (f+0.0) * 2/100;
            val_color = [
                fuel_zero[0] * (1-perc) + perc * fuel_50[0],
                fuel_zero[1] * (1-perc) + perc * fuel_50[1],
                fuel_zero[2] * (1-perc) + perc * fuel_50[2]
            ]
        }
        else {
            let perc = (f+0.0 - 50) * 2/100;
            val_color = [
                fuel_50[0] * (1-perc) + perc * fuel_max[0],
                fuel_50[1] * (1-perc) + perc * fuel_max[1],
                fuel_50[2] * (1-perc) + perc * fuel_max[2]
            ];
        }
        return "rgb(" + Math.floor(val_color[0]).toString() +","+ 
                Math.floor(val_color[1]).toString()+"," + 
                Math.floor(val_color[2]).toString()+")"; 
        // for a better gradient, considering all the channels
    }

    
}
