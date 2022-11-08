class DrillSprite extends Sprite {
    constructor(config) {
        super(config);
        this.animations = config.animations || {
            'drilling': [ [0, 0], [1, 0], [2, 0], [3, 0], [4,0],[3,0],  [2,0], [1,0] ],
        }
        this.currentAnimation = config.currentAnimation || 'drilling';
        this.currentAnimationFrame = 0;
        this.animationFrameLimit = config.animationFrameLimit || 8;
        // number of time frames per animation frame "time frames"
        // "https://en.wikipedia.org/wiki/Planck_units"
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;
    }

    updateAnimationProgress() {
        if(this.animationFrameProgress > 0) {
            this.animationFrameProgress--;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.animations[this.currentAnimation].length;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    draw(ctx, camera) {
        const [x, y] = this.frame;
        let dim = 32;
        this.isLoaded && ctx.drawImage(this.image,
                                       x * dim, y * dim,
                                       dim, dim,
                                       (this.gameObject.x - camera.x)+3*64, (this.gameObject.y - camera.y)+2*64,
                                       64, 64
        );
        this.updateAnimationProgress();
    }
}