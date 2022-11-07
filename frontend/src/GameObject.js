class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.sprite = new Sprite({
            src: config.src,
            gameObject: this
        });
    }

}
