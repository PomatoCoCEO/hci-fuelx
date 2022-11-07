class PlayerSprite extends Sprite {

    constructor(config) {
        super(config);

        this.animations = config.animations || {
            'idle-left': [ [0, 0] ],
            'idle-right': [ [0, 1] ],
            'idle-down': [ [0, 2] ],
            'idle-up': [ [0, 3] ],
            'walk-left': [ [0, 0], [1, 0], [2, 0], [3, 0] ],
            'walk-right': [ [0, 1], [1, 1], [2, 1], [3, 1] ],
            'walk-down': [ [0, 2], [1, 2], [2, 2], [3, 2] ],
            'walk-up': [ [0, 3], [1, 3],[2, 3],[3, 3] ]
        };

        this.currentAnimation = config.currentAnimation || 'idle-down';
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

    setAnimation(key) {
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        if(this.animationFrameProgress > 0) {
            this.animationFrameProgress--;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.animations[this.currentAnimation].length;
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