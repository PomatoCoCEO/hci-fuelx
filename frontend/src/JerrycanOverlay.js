class JerrycanOverlay {

    constructor(config) {
        this.overlay = config.overlay;
        this.jerrycans = 0;
        this.jerrycanImage = "static/images/jerrycan_animation.png";
        this.game = config.game;
        this.quantity = 0;
        this.init();
        // this.radius = 75;
    }

    set(jerrycans) {
        this.fuel = jerrycans;
        this.element.innerHTML = `
                <div class="jerrycan-overlay">
                    <img class="jerrycan-image" src = "${this.jerrycanImage}">
                    <div class="jerrycan-quantity">${this.fuel}<div>
                </div>
            `;
        const offsetX = 8;
        const offsetY = -6.5;
        let str = `translate(${Math.round(offsetX)}vh,${Math.round(offsetY)}vh)`;
        this.element.style.transform = str;
        this.element.style.scale = 6;
        this.element.style.imageRendering = "pixelated";
    }

    createElement() {
        this.element = document.createElement('div');
    }

    close() {
        this.element.remove();
    }

    init() {
        this.createElement();
        this.set(0);
        this.overlay.appendChild(this.element);
    }

}