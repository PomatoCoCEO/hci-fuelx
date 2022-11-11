class JerrycanSprite extends Sprite {
    constructor(config) {
        super(config);
        this.gameObject = config.gameObject;
        this.dim = 32; // dimension of the picture frame to display
        this.currentAnimation = config.currentAnimation || 'shiny';
        this.animations = config.animations || {
            "shiny" : [ [0, 0], [1, 0], [2, 0], [3, 0], [4,0], [5,0], [6,0], [7,0], [8,0] ],
        }
    }

}