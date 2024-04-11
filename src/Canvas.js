class Canvas {
  constructor(containerId, options) {
    this.canvas = document.createElement('canvas');
    this.container = document.getElementById(containerId);
    this.options = options || {};
    this.canvas.width = this.options.width || 640;
    this.canvas.height = this.options.height || 448;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.view = {
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    };

    this.sprites = {
      player0r: new Sprite(1, 2),
      player0l: new Sprite(5, 2),
      player1r: new Sprite(2, 2),
      player1l: new Sprite(6, 2),
      playerjr: new Sprite(6, 4),
      playerjl: new Sprite(5, 4),
      bullet: new Sprite(0, 14, 13, 10),
      spider: new Sprite(2, 10, 100, 64),
      T: new AnimatedSprite(0, 4, 64, 64, 5), // trophy
      J: new Sprite(8, 1), // jetpack
      Z: new Sprite(3, 1), // gun
      P: new Sprite(2, 1), // purple orbs
      R: new Sprite(1, 1), // red gem
      D: new Sprite(0, 1), // blue gem
      B: new Sprite(1, 0), // red brick
      L: new Sprite(2, 0), // blue brick
      A: new Sprite(6, 0), // triangular brown pattern
      '/': new Sprite(7, 0), // triangular brown pattern
      '\\': new Sprite(8, 0), // triangular brown pattern
      G: new Sprite(3, 0), // brown pattern brick
      Q: new Sprite(5, 0), // blue synthetic
      '-': new Sprite(4, 8), // purple platform
      '=': new Sprite(1, 8), // door
      '+': new Sprite(2, 8), // pipe left
      E: new Sprite(4, 1), // ring
      Y: new Sprite(5, 1), // wand
      C: new Sprite(6, 1), // crown
      F: new AnimatedSprite(0, 5, 64, 64, 4), // fire
      W: new AnimatedSprite(0, 7, 64, 64, 3), // water
      S: new AnimatedSprite(0, 6, 64, 64, 4) // purple snakes
    };
  }

  setScroll(dx) {
    this.view.x = dx;
  }

  drawTile(tile, i, j) {
    const x = i * Tile.size;
    const y = j * Tile.size;

    if (this.sprites[tile]) {
      if (tile === 'T') {
        this.sprites[tile].animate(this.ctx, x - this.view.x, y - this.view.y, 100);
        return;
      }

      if (tile === 'F') {
        this.sprites[tile].animate(this.ctx, x - this.view.x, y - this.view.y, 3);
        return;
      }

      if (tile === 'W') {
        this.sprites[tile].animate(this.ctx, x - this.view.x, y - this.view.y, 10);
        return;
      }

      if (tile === 'S') {
        this.sprites[tile].animate(this.ctx, x - this.view.x, y - this.view.y, 7);
        return;
      }

      this.drawSprite(x, y, tile);
      return;
    }
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(x - this.view.x, y - this.view.y, Tile.size, Tile.size);
  }

  drawSprite(x, y, sprite) {
    this.sprites[sprite].draw(this.ctx, x - this.view.x, y - this.view.y);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
