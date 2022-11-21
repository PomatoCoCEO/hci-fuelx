export default class Player {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.direction = config.direction;
        this.observers = config.game.observers;
        this.notifyAll = config.game.notifyAll;
        this.fuel = 100;
        this.jerrycans = 0;

        this.directionUpdate = {
            'up': ['y', -64],
            'down': ['y', 64],
            'left': ['x', -64],
            'right': ['x', 64]
        }
    }

    get shortId() {
        return (`${this.id}`).substring(0, 9);
    }

    move(direction) {
        if(!this.directionUpdate[direction])
            return;
        const [property, change] = this.directionUpdate[direction];
        this[property] += change;
        this.updateFuel(this.fuel - 1);
    }

    updateFuel(fuel) {
        this.fuel = fuel;
        this.notifyAll({
            type: 'fuel-update',
            args: {
                playerId: this.id,
                fuel: this.fuel
            }
        });
        if(this.fuel <= 0) {
            this.notifyAll({
                type: 'notification',
                args: {
                    type: 'error',
                    title: 'DEAD',
                    description: `${this.shortId} died.`
                }
            });
        }
    }

}