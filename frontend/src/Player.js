class Player extends GameObject {
    constructor(config) {
        super(config);
        this.id = config.id;
        this.name = config.name;
        this.fuel = config.fuel | 100;
        this.jerrycans = config.jerrycans | 0;
        this.moveDelta = 1;
        this.directionUpdate = {
            'up': ['y', -this.moveDelta],
            'down': ['y', this.moveDelta],
            'left': ['x', -this.moveDelta],
            'right': ['x', this.moveDelta],
        };
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
        this.flee = false;
        this.busy = false;
    }

    clean() {
        this.element.remove();
    }

    updateName(camera) {
        this.element.querySelector('.Character_name').innerHTML = (`${this.id}`).substring(0, 9);
        const left = (this.x - camera.x) * (this.game.container.offsetWidth / this.game.canvas.width);
        const top = (this.y - camera.y) * (this.game.container.offsetWidth*3/4 / this.game.canvas.height);
        this.element.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }64

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += (this.flee?6:2)*change;
        if(this.movingProgressRemaining == 0) {
            this.sprite.setAnimation('idle-' + this.direction);
            this.flee = false;
            this.busy = false;
        }
        else this.movingProgressRemaining -= 2;
    }

    updateSprite() {
        if(this.movingProgressRemaining === 0) {
            if(this.isDead()) {
                if(!this.deadAnimation) {
                    let camera = this.game.map.camera;
                    let dist = Math.pow(this.x - camera.x, 2) + Math.pow(this.y - camera.y, 2);
                    if(Math.sqrt(dist)/32 <= 3)
                        this.game.audios.dead.play();
                    this.sprite.setAnimation('dying', 16);
                    this.deadAnimation = true;
                } else if(this.sprite.currentAnimationFrame == this.sprite.animations[this.sprite.currentAnimation].length - 1){
                    this.sprite.setAnimation('dead');
                }
            } else {
                this.busy = false;
                this.sprite.setAnimation('idle-' + this.direction);
                // this.direction = "still";
            }
        }  else if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation('walk-' + this.direction);
        }
    }

    startBehaviour(config, behavior) {
        if(!this.isDead()) {
            this.direction = config.direction;
            this.action = config.action;
            if(behavior.type === 'walk' || behavior.type == "flee") {
                this.movingProgressRemaining = 64;
                if(behavior.type == "flee") this.flee = true;
                else this.flee = false;
                if(this.flee) {
                    let camera = this.game.map.camera;
                    let dist = Math.pow(this.x - camera.x, 2) + Math.pow(this.y - camera.y, 2);
                    if(Math.sqrt(dist)/32 <= 3)
                        this.game.audios.flee.play();
                } else if(this.isPlayerControlled)
                    this.game.audios.move.play();
            }
        }
        else {
            this.movingProgressRemaining = 0;
            this.updateSprite();
        }
    }

    updatePending() {
        if(this.movingProgressRemaining <= 0) {
            if(this.pending.length > 0) {
                this.movingProgressRemaining = -1;
                let p = this.pending.shift();
                if(p.config.direction === "still") {
                    this.movingProgressRemaining = 0;
                } else {
                    this.startBehaviour(p.config, {
                        type: p.type
                    });
                }
            }
        }
    }

    forceUpdate(config) {
        // let direction = config.direction;
        // let act = this.directionUpdate[direction];

        this.pending.push({
            config: config,
            type: config.type
        });
    }

    update(config) {
        if(this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            if(this.isPlayerControlled && !this.busy){
                if(config.direction && this.fuel > 0) {
                    this.busy = true;
                    this.movingProgressRemaining = -1;
                    this.game.socketHandler.movePlayer(config.direction);
                    // this.startBehaviour(config, {
                    //     type: 'walk'
                    // });
                }
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
