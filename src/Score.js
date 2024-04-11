class Score {
  constructor(containerId, game) {
    this.value = 0;
    this.game = game;
    this.canvas = document.createElement('canvas');
    this.container = document.getElementById(containerId);
    this.canvas.width = 640;
    this.canvas.height = 40;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  update() {
    this.drawBoard();
  }

  drawSprite(x, y, sprite) {
    this.sprites[sprite].draw(this.ctx, x, y);
  }

  drawBoard() {
    const formatNumberLength = (num, len) => {
      let r = '' + num;
      while (r.length < len) {
        r = '0' + r;
      }
      return r;
    };

    let info;
    if (this.game.level.isLevelingUp) {
      info = `GOOD WORK! ONLY ${this.game.lastLevel - this.game.currentLevel} MORE TO GO!`;
      if (this.game.currentLevel === this.game.lastLevel) {
        info = 'CONGRATULATIONS!';
      }
    } else {
      info = 'SCORE:' + formatNumberLength(this.value, 5) +
        '  LEVEL:' + formatNumberLength(this.game.currentLevel + 1, 2) +
        '  LIVES:' + this.game.lives;
    }

    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#e5dfe4';
    this.ctx.fillRect(0, this.canvas.height - 4, this.canvas.width, 4);
    this.ctx.fillStyle = '#90ee90';
    this.ctx.font = '20px GameFont';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(info, this.canvas.width / 2, 28);
  }
}