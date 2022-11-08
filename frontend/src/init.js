(() => {
    const game = new Game({
       container: document.querySelector('.game-container'),
       socket: io("ws://localhost:4000")
    });
    game.init();
})();
