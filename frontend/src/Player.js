class Player extends GameObject {

    constructor(config) {
        super(config);
        this.pos = {
            x: 0,
            y: 0
        };
        this.name = config.name;
        this.fuel = 100;
        this.jerrycans = 0;
        this.directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1]
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