(() => {
    const game = new Game({
       container: document.querySelector('.game-container'),
       overlay: document.querySelector('.overlay')
    });
    game.init();
})();
