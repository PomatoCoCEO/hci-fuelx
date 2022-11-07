class GameObject {
    constructor(config) {
        this.sprite = new Sprite({
            src: config.src,
            gameObject: this
        });
    }

}
