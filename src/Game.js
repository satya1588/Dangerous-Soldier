class Game {
  constructor(containerId, options) {
    this.input;
    this.sound;
    this.score;
    this.level;
    this.canvas;
    this.frame = 1;
    this.animator;
    this.lives = 3;
    this.restart = false;
    this.nextLevel = false;
    this.currentLevel = 0;
    this.lastLevel = 2;
    this.options = options;
    this.containerId = containerId;
    this.hasGameFinished = false;
    this.start();
  }

  loop() {
    if (this.update()) {
      this.render();
      this.animator = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  update() {
    if (this.lives < 0) {
      this.end();
      window.cancelAnimationFrame(this.animator);
      return false;
    }

    if (this.nextLevel) {
      this.currentLevel++;
      if (this.currentLevel > this.lastLevel) {
        this.end();
        window.cancelAnimationFrame(this.animator);
        return false;
      }
    }

    if (this.restart || this.nextLevel) {
      this.restart = false;
      this.nextLevel = false;
      this.level = new Level(this, this.currentLevel);
      this.input.clear();
      this.frame = 1;
    }

    if (!this.level.isLevelingUp) {
      this.input.update();
    }

    this.score.update();
    this.level.update();
    this.frame++;
    return true;
  }

  render() {
    this.level.draw();
  }

  start() {
    const self = this;
    let blinkFlag = false;
    const startCanvas = document.createElement('canvas');
    const startCtx = startCanvas.getContext('2d');
    const container = document.getElementById(self.containerId);
    container.appendChild(startCanvas);

    startCanvas.width = 600;
    startCanvas.height = 440;

    setInterval(drawStartScreen, 1000);
    window.addEventListener('keydown', startScreenEventHandler);

    function drawStartScreen() {
      startCtx.fillStyle = '#000';
      startCtx.fillRect(0, 0, startCanvas.width, startCanvas.height);
      startCtx.fillStyle = '#90ee90';
      startCtx.font = '50px GameFont';
      startCtx.textAlign = 'center';

      startCtx.fillText('DANGEROUS', startCanvas.width / 2, 120);
      startCtx.fillText('Soldier', startCanvas.width / 2, 200);

      startCtx.font = '20px GameFont';

      if (!blinkFlag) {
        startCtx.fillText('PRESS OK KEY TO CONTINUE!', startCanvas.width / 2, 380);
      } else {
        startCtx.fillText('PRESS OK KEY TO CONTINUE', startCanvas.width / 2, 380);
      }

      blinkFlag = !blinkFlag;
    }

    function initGameObjects() {
      self.input = new Input();
      self.sound = new Sound();
      self.score = new Score(self.containerId, self);
      self.canvas = new Canvas(self.containerId, self.options);
      self.level = new Level(self, self.currentLevel);
    }

    function startScreenEventHandler(e) {
      if (e.keyCode === 13) {
        container.removeChild(startCanvas);
        window.removeEventListener('keydown', startScreenEventHandler);
        initGameObjects();
        self.loop();
      }
    }
  }

  end() {
    const self = this;
    const endCanvas = document.createElement('canvas');
    self.canvas.canvas.insertAdjacentElement('afterend', endCanvas);
    const endCtx = endCanvas.getContext('2d');

    let inputBuffer = '';

    endCanvas.width = 600;
    endCanvas.height = 300;
    endCanvas.classList.add('end-canvas');

    drawInputBoard();
    window.addEventListener('keydown', endScreenEventHandler);

    function endScreenEventHandler(e) {
      if (e.keyCode === 13) {
        saveScore({ name: "Player", score: self.score.value });
        window.removeEventListener('keydown', endScreenEventHandler);
        drawScoreBoard();
        self.hasGameFinished = true;
        return;
      }
    }
    
    function drawInputBoard() {
      endCtx.fillStyle = '#f5f5f5';
      endCtx.fillRect(0, 0, endCanvas.width, endCanvas.height);
      endCtx.fillStyle = '#ff00ff';
      endCtx.font = '25px GameFont';
      endCtx.textAlign = 'center';
    
      endCtx.fillText('SCORE:' + self.score.value, endCanvas.width / 2, 130);
      endCtx.font = '15px GameFont';
      endCtx.fillText('PRESS ENTER TO RESTART!', endCanvas.width / 2, 180);
    }
    

    function drawScoreBoard() {
      endCtx.fillStyle = '#f5f5f5';
      endCtx.fillRect(0, 0, endCanvas.width, endCanvas.height);
      endCtx.fillStyle = '#ff00ff';
      endCtx.textAlign = 'center';
      endCtx.font = '30px GameFont';
      endCtx.fillText('HIGHSCORES', endCanvas.width / 2, 50);

      const scoreInfo = readScore();
      let scoreY = 50;

      let scoreCounter = scoreInfo.length > 5 ? 5 : scoreInfo.length;

      for (let i = 0; i < scoreCounter; i++) {
        endCtx.textAlign = 'left';
        endCtx.font = '20px GameFont';
        endCtx.fillText((i + 1), 135, scoreY + 50);
        endCtx.fillText(scoreInfo[i].name, 210, scoreY + 50);
        endCtx.textAlign = 'right';
        endCtx.fillText(scoreInfo[i].score, 460, scoreY + 50);
        scoreY += 30;
      }

      endCtx.font = '15px GameFont';
      endCtx.textAlign = 'center';
      endCtx.fillText('PRESS ENTER TO RESTART!', endCanvas.width / 2, 280);
    }

    function saveScore(scoreProp) {
      let scoreInfo;

      if (localStorage.getItem('scoreInfo') === null) {
        scoreInfo = [];
      } else {
        scoreInfo = JSON.parse(localStorage.getItem('scoreInfo'));
      }

      scoreInfo.push(scoreProp);
      scoreInfo.sort((a, b) => b.score - a.score);
      localStorage.setItem('scoreInfo', JSON.stringify(scoreInfo));
    }

    function readScore() {
      let scoreInfo;

      if (localStorage.getItem('scoreInfo') === null) {
        scoreInfo = [];
      } else {
        scoreInfo = JSON.parse(localStorage.getItem('scoreInfo'));
      }

      return scoreInfo;
    }
  }
}
