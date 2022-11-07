class Sprite {

    constructor(config) {
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.animations = config.animations;

        
        this.currentAnimation = config.currentAnimation;
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        // number of time frames per animation frame "time frames"
        // "https://en.wikipedia.org/wiki/Planck_units"
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;
    }

    get frame() {
        return [0,0];
    }

    draw(ctx, camera) {
        const [x, y] = this.frame;
        let dim = 32;

        this.isLoaded && ctx.drawImage(this.image,
                                       x * dim, y * dim,
                                       dim, dim,
                                       (this.gameObject.x - camera.x)+3*64, (this.gameObject.y - camera.y)+2*64,
                                       128, 128
        );
    }

}