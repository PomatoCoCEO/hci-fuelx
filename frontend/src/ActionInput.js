class ActionInput {
    constructor() {
        this.heldActions = [];
        this.heldKeys = [];
        this.map = {
            'KeyV': 'drill',
            'KeyC': 'commit-to-jerrycans',
            'KeyR': 'refuel',
        }
    }

    get action() {
        return this.heldActions[0];
    }

    isHold(code) {
        return this.heldKeys.indexOf(code) > -1;
    }

    init() {
        document.addEventListener('keydown', e => {
            const action = this.map[e.code];
            if(action && this.heldActions.indexOf(action) === -1){
                this.heldActions.unshift(action);
                console.log("action", action);
            }
            if(this.heldKeys.indexOf(e.code) === -1)
                this.heldKeys.push(e.code);
        });

        document.addEventListener('keyup', e => {
           const action = this.map[e.code];
           const index = this.heldActions.indexOf(action);
           if(index > -1)
               this.heldActions.splice(index, 1);
           const indexHelper = this.heldKeys.indexOf(e.code);
           if(indexHelper > -1)
               this.heldKeys.splice(indexHelper, 1);
        });
    }
}