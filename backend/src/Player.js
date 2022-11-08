export class Player {
    constructor(id, name, x, y, direction) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.fuel = 100;
        this.jerrycans = 0;
        this.health = 100;
    }
}