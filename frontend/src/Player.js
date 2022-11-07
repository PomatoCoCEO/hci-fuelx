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
        if(behavior.type === 'walk') {
            // TODO: Verify if next position is empty
            this.movingProgressRemaining = 64;
        }
    }

    update(config) {
        if(this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            if(this.isPlayerControlled && config.direction) {
                this.startBehaviour(config, {
                    type: 'walk'
                });
            }
            this.updateSprite();
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