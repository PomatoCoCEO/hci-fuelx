class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.sprite = new Sprite({
            src: config.src || undefined,
            gameObject: this
        });
        this.game = config.game;
        this.animations = config.animations || {"default": [[0, 0]]};
    }

    update() {
    }

    updatePending() {

    }

}
