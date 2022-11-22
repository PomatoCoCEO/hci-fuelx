class Jerrycan extends GameObject {
    constructor(config) {
        super(config);
        this.fuel = config.fuel || 0;
        this.sprite = new JerrycanSprite({
            src: config.src || "static/images/jerrycan_animation.png",
            gameObject: this
        });
    }
}