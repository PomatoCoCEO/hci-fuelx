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
                <div class="jerrycan-quantity">${this.fuel}</div>
                    <div class="jerrycan-image" src = "${this.jerrycanImage}"></div>
                </div>
            `;
        this.element.style.imageRendering = "pixelated";
    }

    setAnimation() {
        this.element.querySelector(".jerrycan-image").style.animation = "moveSpriteSheet 1.5s steps(9) infinite";
        console.log('animation started');
        setTimeout(() => {
            this.element.querySelector(".jerrycan-image").style.animation = "";
        }, 2000);
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