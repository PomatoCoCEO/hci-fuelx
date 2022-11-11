class Drill extends GameObject {
    constructor(config) {
        super(config);
        this.totalFuel = 0;
        this.sprite = new DrillSprite({
            src: config.src || "static/images/drill.png",
            gameObject: this
        });
        this.tile = config.tile;

    }

    // updateAnimationProgress() {
    //     if(this.animationFrameProgress > 0) {
    //         this.animationFrameProgress--;
    //         return;
    //     }

    //     this.animationFrameProgress = this.animationFrameLimit;
    //     this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.animations[this.currentAnimation].length;
    // }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }


}