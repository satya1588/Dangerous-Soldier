class Player extends Entity {
  constructor(game, position) {
    super(game, position.x * Tile.size, position.y * Tile.size);
    this.width = Tile.size - 4;
    this.height = Tile.size;
    this.direction = 1;
    this.velY = 0;
    this.isJumping = false;
    this.t = 0;
    this.dead = false;
    this.hasTrophy = false;
    this.hasGun = false;
    this.hasJetpack = false;
    this.jetpackFuel = 100;
    this.isUsingJetpack = false;
  }

  update() {
    const { keys } = this.game.input;
    const vel = 2.5;

    if (this.isUsingJetpack) {
      if (keys.up.hold) {
        this.y -= vel;
        this.adjustJump();
      }
      if (keys.down.hold) {
        this.y += vel;
        this.adjustFall();
      }
      this.jetpackFuel -= 0.1;
    } else {
      if (keys.up.hold) {
        if (!this.isJumping && this.canJump()) {
          this.t = 5;
          this.isJumping = true;
          this.velY = vel;
          this.jumpGoal = this.y - 2.2 * Tile.size;
          this.game.sound.play('jump');
        }
      }

      if (!this.isJumping && !this.canJump()) {
        this.y += this.velY;
        this.velY += 0.05;

        if (this.velY >= vel) {
          this.velY = vel;
        }

        this.adjustFall();
      }

      if (this.isJumping) {
        this.y -= this.velY;
        this.velY -= 0.01;

        if (this.y <= this.jumpGoal) {
          this.y = this.jumpGoal;
          this.isJumping = false;
          this.velY = 0;
        }

        this.adjustJump();
      }
    }

    if (keys.right.hold) {
      this.x += vel;
      this.direction = 1;
      this.adjustWalk('right');
    }

    if (keys.left.hold) {
      this.x -= vel;
      this.direction = -1;
      this.adjustWalk('left');
    }

    if ((keys.left.hold || keys.right.hold) && this.canJump()) {
      this.game.sound.play('walk');
    }

    if (keys.z.pulse && this.hasGun) {
      this.game.sound.play('playerGunshot');
      this.shoot(8);
    }

    if (keys.x.pulse && this.hasJetpack) {
      this.isUsingJetpack = !this.isUsingJetpack;

      if (this.isUsingJetpack) {
        this.isJumping = false;
      }
    }

    if (this.jetpackFuel < 0) {
      this.hasJetpack = false;
      this.isUsingJetpack = false;
      this.jetpackFuel = 100;
    }

    this.touchTiles();
  }

  canJump() {
    this.y++;
    const ret = this.clipped('down');
    this.y--;
    return ret;
  }

  adjustWalk(direction) {
    if (this.clipped(direction)) {
      if (direction === 'left') {
        this.x += this.width - 1;
      }
      this.x = Tile.size * Math.floor(this.x / Tile.size);
      if (direction === 'right') {
        return (this.x += Tile.size - this.width);
      }
    } else {
      if (this.canJump()) {
        this.t++;
      }
    }
  }

  adjustJump() {
    if (this.clipped('up')) {
      this.game.sound.stop('jump');
      this.y += Tile.size;
      this.y = Tile.size * Math.floor(this.y / Tile.size);
      this.isJumping = false;
      this.velY = 0;
    }
  }

  adjustFall() {
    if (this.clipped('down')) {
      this.y = Tile.size * Math.floor(this.y / Tile.size);
    }
  }

  draw() {
    let sprite = 'player';
    sprite += Math.floor(this.t / 5) % 2;
    sprite += this.direction === 1 ? 'r' : 'l';

    if (this.isUsingJetpack) {
      sprite = 'playerj';
      sprite += this.direction === 1 ? 'r' : 'l';
    }

    this.game.canvas.drawSprite(this.x, this.y, sprite);
  }

  touchTiles() {
    const tiles = this.getTouchedTiles();
    for (let tile of tiles) {
      if (tile.tile === 'T') {
        this.game.sound.play('trophy');
        this.hasTrophy = true;
      }

      if (tile.tile === '=') {
        if (this.hasTrophy) {
          this.hasTrophy = false;
          this.hasGun = false;
          this.hasJetpack = false;
          this.isUsingJetpack = false;
          this.game.sound.play('door');
          this.game.input.clear();
          this.game.level.isLevelingUp = true;
          this.x = Tile.size;
          this.y = 4 * Tile.size;
        }
      }

      if (tile.tile === 'Z') {
        this.hasGun = true;
      }

      if (tile.tile === 'J') {
        this.hasJetpack = true;
      }

      if (Tile.isLethal(tile.tile)) {
        this.game.sound.play('playerExplosion');
        this.kill();
      }

      if (Tile.isPickable(tile.tile)) {
        this.game.sound.play('pickup');
        this.game.score.value += Tile.scoreValue(tile.tile);
        this.game.level.clearTile(tile.x, tile.y);
      }
    }
  }

  kill() {
    if (!this.dead) {
      this.dead = true;
      this.game.lives--;
      this.game.restart = true;
    }
  }
}
