class Notification {

    constructor(config) {
        this.overlay = config.overlay;
        this.type = config.type;
        this.title = config.title;
        this.description = config.description;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('notification', this.type);
        this.element.innerHTML = (`
            <div class="title">${this.title}</div>
            <div class="description">${this.description}</div>
        `);
        this.overlay.appendChild(this.element);

        setTimeout(() => {
            this.clean();
        }, 5000);
    }

    clean() {
        this.element.remove();
    }

}