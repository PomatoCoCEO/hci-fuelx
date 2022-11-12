(() => {
    const game = new Game({
       container: document.querySelector('.game-container'),
       overlay: document.querySelector('.overlay'),
       notifications: document.querySelector('.notifications')
    });
    game.init();
})();
