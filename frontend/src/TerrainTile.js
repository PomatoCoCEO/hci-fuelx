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
            return this.fl;
        }
        this.fl = 0;
        return this.fl;
        // return this.fuelLevel;
    }

    color() {
        let f = this.fuelLevel;
        // colors defined in the gradient: light yellow
        let fuel_zero = [parseInt("ff", 16), parseInt("fd", 16), parseInt("76", 16)];
        // let fuel_50 = parseInt("ff8800", 16);  // orange
        let fuel_50 = [parseInt("ff", 16), parseInt("88", 16), parseInt("00", 16)];
        let fuel_max = [parseInt("6f", 16), parseInt("3f", 16), parseInt("00", 16)];
        let val_color = 0;
        if ( f < 50) {
            let perc = f * 2;
            val_color = [
                fuel_zero[0] + (fuel_50[0] - fuel_zero[0]) * perc / 100,
                fuel_zero[1] + (fuel_50[1] - fuel_zero[1]) * perc / 100,
                fuel_zero[2] + (fuel_50[2] - fuel_zero[2]) * perc / 100
            ]
        }
        else {
            let perc = (f - 50) * 2;
            val_color = [
                fuel_50[0] + (fuel_max[0] - fuel_50[0]) * perc / 100,
                fuel_50[1] + (fuel_max[1] - fuel_50[1]) * perc / 100,
                fuel_50[2] + (fuel_max[2] - fuel_50[2]) * perc / 100
            ];
        }
        return "#" + Math.floor(val_color[0]).toString(16) + Math.floor(val_color[1]).toString(16) + Math.floor(val_color[2]).toString(16); 
        // for a better gradient, considering all the channels
    }

    
}
