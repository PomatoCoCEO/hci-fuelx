export default class Player {
    constructor(id, name, x, y, direction) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.fuel = 100;
        this.jerrycans = 0;

        this.directionUpdate = {
            'up': ['y', -64],
            'down': ['y', 64],
            'left': ['x', -64],
            'right': ['x', 64]
        }
    }

    move(direction) {
        if(!this.directionUpdate[direction])
            return;
        const [property, change] = this.directionUpdate[direction];
        this[property] += change;
        this.fuel--;
    }

}