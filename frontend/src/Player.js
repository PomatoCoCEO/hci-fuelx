class Player extends GameObject {
    constructor(config) {
        super(config);
        this.name = config.name;
        this.fuel = 100;
        this.jerrycans = 0;
        this.directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1]
        }
        this.direction = config.direction || 'right';

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.movingProgressRemaining = 0;
        this.sprite = new PlayerSprite({
            src: config.src || undefined,
            gameObject: this
        });
        this.drills = []; // for the drills in the user's inventory
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining--;
    }

    updateSprite() {
        if(this.movingProgressRemaining > 0) {
            this.sprite.setAnimation('walk-' + this.direction);
        } else {
            this.sprite.setAnimation('idle-' + this.direction);
        }
    }

    startBehaviour(config, behavior) {
        this.direction = config.direction;
        this.action = config.action;
        if(behavior.type === 'walk') {
            // TODO: Verify if next position is empty
            this.movingProgressRemaining = 64;
        }
    }

    update(config) {
        if(this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            if(this.isPlayerControlled){
                if(config.direction) {
                    this.startBehaviour(config, {
                        type: 'walk'
                    });
                }
                else if(config.action === 'commit-to-jerrycans') {
                    this.commitToJerrycans();
                }
                else if (config.action === 'drill') {
                    if(this.game.isCellAvailable(this.x, this.y)) {
                        console.log("Pushing new drill....");
                        this.drills.push(new Drill({
                            src: "static/images/drill.png",
                            x: this.x,
                            y: this.y,
                            game: this.game
                        }));
                    }
                    else {
                        console.log("Cell not available");
                    }
                }
            this.updateSprite();
            }
        }
    }

    commitToJerrycans() { // commits the fuel to jerrycans
        let x = this.fuel / 2.0;
        this.jerrycans += x;
        this.fuel -= x;
    }

    isDead() {
        return fuel <= 0;
    }
    
}