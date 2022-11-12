class TumbleweedSprite extends Sprite {
    constructor(config) {
        super(config);
        this.animations = config.animations || {
            'right': [ [0, 0], [1, 0], [2, 0], [3, 0] ],
            'left': [ [3, 0], [2, 0], [1, 0], [0, 0] ]
        }
        this.currentAnimation = config.currentAnimation || 'left';
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        // number of time frames per animation frame "time frames"
        // "https://en.wikipedia.org/wiki/Planck_units"
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;
    }


    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    draw(ctx, camera) {
        super.draw(ctx, camera);
        this.gameObject.update();
    }
}