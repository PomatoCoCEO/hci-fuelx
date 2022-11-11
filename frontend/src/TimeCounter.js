class TimeCounter {
    
    constructor(container) {
        this.container = container;
        this.begin_time = new Date().getTime();
    }

    createElement() {
        this.element = document.createElement('h1');
        this.element.setAttribute("id", "timer");
    }

    update() {
        var now = new Date().getTime();

        var dif = this.begin_time - now;

        var minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60))+10;
        var seconds = Math.floor((dif % (1000 * 60)) / 1000)+60;

        if(seconds < 10) {
            this.element.innerHTML = minutes.toString() + ":0" + seconds.toString();
        }else {
            this.element.innerHTML = minutes.toString() + ":" + seconds.toString();
        }
    }

    init() {
        this.createElement();
        this.container.appendChild(this.element);
    }

}