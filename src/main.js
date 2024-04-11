let game = new Game('game-container', { width: 640, height: 400 });

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && game.hasGameFinished) {
    const parentElement = document.getElementById(game.containerId);

    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }

    game = new Game('game-container', { width: 640, height: 400 });
  }
});