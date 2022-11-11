class Sprite {

    constructor(config) {
        if(config.src) {
            this.image = new Image();
            this.image.src = config.src;
            this.image.onload = () => {
                this.isLoaded = true;
            }
        }

        this.animations = config.animations || {
            'default': [ [0, 0] ],
        };

        
        this.currentAnimation = config.currentAnimation || 'default';
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        // number of time frames per animation frame "time frames"
        // "https://en.wikipedia.org/wiki/Planck_units"
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;
        this.dim = config.dim || 32;
        this.dim_final = config.dim_final || 64;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    updateAnimationProgress() {
        if(this.animationFrameProgress > 0) {
            this.animationFrameProgress--;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame = (this.currentAnimationFrame + 1) % 
            this.animations[    
                this.currentAnimation
            ].length;
    }

    draw(ctx, camera) {
        const [x, y] = this.frame;
        let dim = this.dim;

        this.isLoaded && ctx.drawImage(this.image,
                                       x * dim, y * dim,
                                       dim, dim,
                                       (this.gameObject.x - camera.x)+3*64, (this.gameObject.y - camera.y)+2*64,
                                       this.dim_final, this.dim_final
        );
        this.updateAnimationProgress();
    }

}