class AnimatedSprite extends Sprite {
  constructor(i, j, sw, sh, framesCount) {
    super(i, j, sw, sh);
    this.currentFrame = 0;
    this.framesCount = framesCount;
    this.frames = 0;
  }

  update(speed) {
    if (this.frames % Math.floor(1000 / speed) === 0) {
      this.currentFrame = ++this.currentFrame % this.framesCount;
      this.srcX = this.sx + this.currentFrame * this.size;
      this.srcY = this.sy;
    }

    this.frames++;
  }

  animate(ctx, x, y, speed) {
    this.update(speed);
    ctx.drawImage(Sprite.image, this.srcX, this.srcY, this.sw, this.sh, x, y, this.dw, this.dh);
  }
}
