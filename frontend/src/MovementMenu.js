class MovementMenu {

    constructor(config) {
        this.overlay = config.overlay;
        this.options = config.options;
        this.radius = 75;
    }

    setOptions() {
        this.element.innerHTML = this.options.map((option, index) => {
            return (`
                <div class="option">
                    <button data-button="${index}" class="move-button ${option.class}">
                    </button>
                </div>
            `);
        }).join("");

        this.element.querySelectorAll("button").forEach(button => {
            let index = Number(button.dataset.button);
            button.addEventListener('click', () => {
                const chosenOption = this.options[index];
                chosenOption.handler();
            });
        });
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('move-menu');
    }

    close() {
        this.element.remove();
    }

    init() {
        this.createElement();
        this.setOptions();
        this.overlay.appendChild(this.element);
    }

}