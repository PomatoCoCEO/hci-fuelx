class Drill extends GameObject {

    constructor(config) {
        super(config);
        this.totalFuel = 0;
        this.sprite = new DrillSprite({
            src: config.src || "static/images/drill.png",
            gameObject: this
        });
    }

}