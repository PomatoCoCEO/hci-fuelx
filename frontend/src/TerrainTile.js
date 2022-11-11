class TerrainTile extends GameObject {
    constructor (config) {
        super(config);
        this.sprite = new TerrainTileSprite({
            src: config.src || undefined,
            gameObject: this
        });
        this.fl = -1;
        // this.fuelLevel = config.fuelLevel || 0;
        // this.hasDrill = false;
    }

    get fuelLevel() {
        if(this.fl != -1)
            return this.fl;
        // if this.game.hasCached(this.x, this.y) return this.game.getCached(this.x, this.y);
        let key = this.game.key;
        let pos_str = pos_to_string(Math.floor(this.x), Math.floor(this.y));
        let hash = pos_str.hashCode();
        let val = (hash ^ key);
        if (val % 4 == 0) {
            this.fl = (val % 400) /4;
            if(this.fl < 0) this.fl = -this.fl;
            return this.fl;
        }
        this.fl = 0;
        return this.fl;
        // return this.fuelLevel;
    }

    decreaseFuel(quant) {
        let to_subtract = Math.min(quant, this.fl);
        this.fl -= to_subtract ;
        return to_subtract;
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
