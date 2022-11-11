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
        this.currentAnimationFrame = (this.currentAnimationFrame + 1) % 
            this.animations[    
                this.currentAnimation
            ].length;
        // this.tile.fuel -=1;
        let recovered = this.gameObject.tile.decreaseFuel(1);
        this.gameObject.totalFuel +=recovered;
        let max_fuel = 20;
        if(recovered == 0 || this.gameObject.totalFuel >= max_fuel) {
            let index = this.gameObject.game.gameObjects.decorations.indexOf(this.gameObject);
            this.gameObject.game.gameObjects.decorations.splice(index, 1);
            this.gameObject.game.gameObjects.jerrycans.push(new Jerrycan({
                x: this.gameObject.x,
                y: this.gameObject.y,
                game: this.gameObject.game,
                fuel: this.gameObject.totalFuel
            }));
        }
    }


    // get frame() {
    //     return this.animations[this.currentAnimation][this.currentAnimationFrame];
    // }


}