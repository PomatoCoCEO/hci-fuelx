export default class Cell {

    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.maxFuel = 99;
        this.drillTime = 60 * 5;
        this.start = 0;
    }

    startDrill() {
        this.start = Date.now();
    }

    collect(player) {
        const diff = (Date.now() - this.start) / 1000;
        const progress = Math.min(1, diff / this.drillTime);
        player.fuel = Math.min(100, player.fuel + this.maxFuel * progress);
        this.progress = 0;
        this.occupied = false;
    }

}