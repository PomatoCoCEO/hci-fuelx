class Player extends GameObject {
    constructor(config) {
        super(config);
        this.id = config.id;
        this.name = config.name;
        this.fuel = config.fuel | 100;
        this.jerrycans = config.jerrycans | 0;
        this.directionUpdate = {
            'up': ['y', -2],
            'down': ['y', 2],
            'left': ['x', -2],
            'right': ['x', 2]
        }
        this.direction = config.direction || 'right';

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.movingProgressRemaining = 0;
        this.sprite = new PlayerSprite({
            src: config.src || undefined,
            gameObject: this
        });
        this.pending = [];
        this.element = document.createElement('div');
        this.element.classList.add("Character", "grid-cell");
        if(this.id === undefined)
            this.element.classList.add("you");
        this.element.innerHTML = (`
            <div class="Character_shadow grid-cell"></div>
                <div class="Character_name-container">
                    <span class="Character_name"></span>
                    <span class="Character_coins">${this.jerrycans}</span>
                </div>
            <div class="Character_you-arrow"></div>
        `);
        this.game.overlay .appendChild(this.element);
        this.deadAnimation = false;
    }

    clean() {
        this.element.remove();
    }

    updateName(camera) {
        this.element.querySelector('.Character_name').innerHTML = (`${this.id}`).substring(0, 9);
        const left = (this.x - camera.x) * (this.game.container.offsetWidth / this.game.canvas.width);
        const top = (this.y - camera.y) * (this.game.container.offsetWidth*3/4 / this.game.canvas.height);
        this.element.style.transform = `translate3d(${left}px, ${top}px, 0)`;
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
            if(this.isDead()) {
                if(!this.deadAnimation) {
                    this.sprite.setAnimation('dying', 16);
                    this.deadAnimation = true;
                } else if(this.sprite.currentAnimationFrame == this.sprite.animations[this.sprite.currentAnimation].length - 1){
                    this.sprite.setAnimation('dead');
                }
            } else {
                this.sprite.setAnimation('idle-' + this.direction);
            }
        }  
    }

    startBehaviour(config, behavior) {
        if(!this.isDead()) {
            this.direction = config.direction;
            this.action = config.action;
            if(behavior.type === 'walk') {
                this.movingProgressRemaining = 32;
            }
        }
    }

    updatePending() {
        if(this.movingProgressRemaining == 0) {
            if(this.pending.length > 0) {
                let p = this.pending.shift();
                this.startBehaviour(p.config, {
                    type: p.type
                });
            }
        }
    }

    forceUpdate(config) {
        this.pending.push({
            config,
            type: 'walk'
        });
    }

    update(config) {
        if(this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            if(this.isPlayerControlled){
                if(config.direction && this.fuel > 0) {
                    this.game.socketHandler.movePlayer(config.direction);
                    this.startBehaviour(config, {
                        type: 'walk'
                    });
                }
                /*else if(config.action === 'commit-to-jerrycans') {
                    this.commitToJerrycans();
                }*/ 
            }
        }
        this.updateSprite();
    }

    /* 
    commitToJerrycans() { // commits the fuel to jerrycans
        let x = Math.floor(this.fuel / 2.0);
        this.fuel -= x;
        this.game.healthBar.decrease(x);

        let new_jerry = this.jerrycans + x;
        this.updateJerrycans({jerrycans: new_jerry});        
    }*/ 

    updateJerrycans({jerrycans}) {
        this.jerrycans = jerrycans;
        this.element.querySelector('.Character_coins').innerHTML = this.jerrycans;
        if(this.isPlayerControlled) {
            this.game.jerrycanOverlay.set(this.jerrycans);
            this.game.jerrycanOverlay.setAnimation();
        }
    }

    isDead() {
        return this.fuel <= 0;
    } 

}
