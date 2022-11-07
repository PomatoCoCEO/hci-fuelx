class Cactus extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            src: "static/images/cactus.png",
            gameObject: this
        });
        console.log("cactus x: ",this.x);
    }

    update() {}
}