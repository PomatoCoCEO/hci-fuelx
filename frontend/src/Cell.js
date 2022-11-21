class Cell extends GameObject {

    constructor(config) {
        super(config);
        this.maxFuel = 99;
        this.drillTime = 60 * 5; // In seconds
        this.progress = 0;
        this.startDrillTime = 0;
        this.occupied = false;
        this.children = [];
    }

    update() {
        if(this.occupied == true && this.progress !== 1) {
            const diff = (Date.now() - this.startDrillTime) / 1000;
            this.progress = Math.min(1, diff / this.drillTime);
            if(this.progress === 1) {
                this.children.pop();
            }
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