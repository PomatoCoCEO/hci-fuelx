class DirectionInput {

    constructor() {
        this.heldDirections = [];
        this.heldKeys = [];

        this.map = {
            'KeyW': 'up',
            'ArrowUp': 'up',
            'KeyS': 'down',
            'ArrowDown': 'down',
            'KeyA': 'left',
            'ArrowLeft': 'left',
            'KeyD': 'right',
            'ArrowRight': 'right',
        }
    }

    get direction() {
        return this.heldDirections[0];
    }

    isHold(code) {
        return this.heldKeys.indexOf(code) > -1;
    }

    pressKey(code) {
        const direction = this.map[code];
        if(direction && this.heldDirections.indexOf(direction) === -1)
            this.heldDirections.unshift(direction);
        if(this.heldKeys.indexOf(code) === -1)
            this.heldKeys.push(code);
    }

    releaseKey(code) {
        const direction = this.map[code];
        const index = this.heldDirections.indexOf(direction);
        if(index > -1)
            this.heldDirections.splice(index, 1);
        const indexHelper = this.heldKeys.indexOf(code);
        if(indexHelper > -1)
            this.heldKeys.splice(indexHelper, 1);
    }

    init() {
        document.addEventListener('keydown', e => {
            this.pressKey(e.code);
        });

        document.addEventListener('keyup', e => {
           this.releaseKey(e.code);
        });
    }

}