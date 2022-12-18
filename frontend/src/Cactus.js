class Cactus extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            src: "static/images/cactus.png",
            gameObject: this, 
            dim: 16,
            dim_final: 64
        });
    }

    update() {}
}