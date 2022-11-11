class Tumbleweed extends GameObject {
    constructor(config) {
        super(config);
        this.directionUpdate = {
            'left': ['x', -1],
            'right': ['x', 1]
        }
        this.direction = config.direction || 'left';
        this.thresX = config.thresX || 1000;
        this.sprite = new TumbleweedSprite({
            src: "static/images/tumbleweed.png",
            gameObject: this
        });
        // console.log("tumbleweed x: ",this.x);
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
    }

    update() {
        this.updatePosition();
        if(Math.abs(this.x)>=this.thresX){
            this.direction = this.direction === 'left' ? 'right' : 'left';
        }
    }

}