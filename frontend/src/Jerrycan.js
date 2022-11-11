class Jerrycan extends GameObject {
    constructor(config) {
        super(config);

        this.sprite = new JerrycanSprite({
            src: config.src || "static/images/jerrycan_animation.png",
            gameObject: this
        });
    }
}