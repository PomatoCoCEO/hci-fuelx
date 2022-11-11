class PlayerSprite extends Sprite {

    constructor(config) {
        super(config);

        this.animations = config.animations || {
            'idle-left': [ [0, 0] ],
            'idle-right': [ [0, 1] ],
            'idle-down': [ [0, 2] ],
            'idle-up': [ [0, 3] ],
            'walk-left': [ [0, 0], [1, 0], [2, 0], [3, 0], [4,0] ],
            'walk-right': [ [0, 1], [1, 1], [2, 1], [3, 1], [4,1] ],
            'walk-down': [ [0, 2], [1, 2], [2, 2], [3, 2], [4,2] ],
            'walk-up': [ [0, 3], [1, 3],[2, 3],[3, 3], [4,3] ]
        };

        this.currentAnimation = config.currentAnimation || 'idle-down';

        this.animationFrameLimit = config.animationFrameLimit || 6;
        this.animationFrameProgress = this.animationFrameLimit;
        // number of time frames per animation frame "time frames"
        // "https://en.wikipedia.org/wiki/Planck_units"
        // DIM IS 32, FINAL DIM IS 64
    }

    

    setAnimation(key) {
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }


    draw(ctx, camera) {
        this.gameObject.updateName(camera);
        super.draw(ctx, camera);
    }

}