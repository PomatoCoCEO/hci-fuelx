class TerrainTile {
    constructor (fuelLevel, hasCactus, hasTumbleWeed) {
        this.fuelLevel = fuelLevel;
        if(fuelLevel == 0) {
            this.hasCactus = hasCactus;
            this.hasTumbleWeed = hasTumbleWeed;
        }
        else {
            this.hasCactus = this.hasTumbleWeed = false;
        }
        this.hasDrill = false;
    }
}