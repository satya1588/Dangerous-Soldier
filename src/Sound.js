class Sound {
  constructor() {
    this.blip = new Audio('assets/sounds/blip.wav');
    this.door = new Audio('assets/sounds/door.wav');
    this.enemyExplosion = new Audio('assets/sounds/enemy-explosion.wav');
    this.enemyGunshot = new Audio('assets/sounds/enemy-gunshot.wav');
    this.jump = new Audio('assets/sounds/jump.wav');
    this.pickup = new Audio('assets/sounds/pickup.wav');
    this.playerExplosion = new Audio('assets/sounds/player-explosion.wav');
    this.playerGunshot = new Audio('assets/sounds/player-gunshot.wav');
    this.trophy = new Audio('assets/sounds/trophy.wav');
    this.walk = new Audio('assets/sounds/walk.ogg');
    this.walk.volume = 0.7;
  }

  play(sfx) {
    this[sfx].play();
  }

  stop(sfx) {
    this[sfx].pause();
    if (this[sfx].currentTime) {
      this[sfx].currentTime = 0;
    }
  }
}