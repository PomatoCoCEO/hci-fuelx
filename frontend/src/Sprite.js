class Sprite {

    constructor(config) {
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.animations = config.animations || {
            'idle-down': [ [0, 0] ],
            'idle-left': [ [0, 1] ],
            'idle-right': [ [0, 2] ],
            'idle-up': [ [0, 3] ],
            'walk-down': [ [0, 0], [1, 0], [2, 0], [3, 0] ],
            'walk-left': [ [0, 1], [1, 1], [2, 1], [3, 1] ],
            'walk-right': [ [0, 2], [1, 2], [2, 2], [3, 2] ],
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

    draw(ctx) {
        const [x, y] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
                                       x * 64, y * 64,
                                       64, 64,
                                       0, 0,
                                       64, 64
        );

        this.updateAnimationProgress();
    }

}