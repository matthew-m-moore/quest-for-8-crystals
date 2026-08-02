// Docked below the HUD at the top-left of the screen, out of the way of
// character sprites (lower two-thirds of the frame) and the black star
// background element (top-right) that needs to stay visible.
const BOX_TOP = 54;
const BOX_HEIGHT = 118;
const BOX_LEFT = 20;
const BOX_WIDTH = 700;

export class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    const boxCenterX = BOX_LEFT + BOX_WIDTH / 2;
    const boxCenterY = BOX_TOP + BOX_HEIGHT / 2;
    this.container = scene.add.container(0, 0).setDepth(1000);

    this.bg = scene.add.rectangle(boxCenterX, boxCenterY, BOX_WIDTH, BOX_HEIGHT, 0xffffff, 0.96)
      .setStrokeStyle(4, 0x333333);
    this.nameText = scene.add.text(BOX_LEFT + 20, BOX_TOP + 10, '', {
      fontSize: '20px', fontStyle: 'bold', color: '#333333',
    });
    this.bodyText = scene.add.text(BOX_LEFT + 20, BOX_TOP + 38, '', {
      fontSize: '22px', color: '#222222', wordWrap: { width: BOX_WIDTH - 60 },
    });
    this.hint = scene.add.text(BOX_LEFT + BOX_WIDTH - 40, BOX_TOP + BOX_HEIGHT - 28, '▼', {
      fontSize: '18px', color: '#888888',
    });
    this.container.add([this.bg, this.nameText, this.bodyText, this.hint]);
    this.container.setVisible(false);

    this._typeTimer = null;
    this._onAdvance = null;

    this.zone = scene.add.zone(boxCenterX, boxCenterY, BOX_WIDTH, BOX_HEIGHT).setInteractive();
    this.zone.on('pointerdown', () => this._advanceOrSkip());
    this.container.add(this.zone);

    this._spaceKey = scene.input.keyboard?.addKey('SPACE');
  }

  say(text, { speaker = '', onDone = null } = {}) {
    this.container.setVisible(true);
    this.nameText.setText(speaker);
    this.bodyText.setText('');
    this.hint.setVisible(false);
    this._full = text;
    this._i = 0;
    this._done = false;
    this._onDoneCb = onDone;

    if (this._typeTimer) this._typeTimer.remove();
    this._typeTimer = this.scene.time.addEvent({
      delay: 18,
      loop: true,
      callback: () => {
        this._i++;
        this.bodyText.setText(this._full.slice(0, this._i));
        if (this._i >= this._full.length) {
          this._typeTimer.remove();
          this._typeTimer = null;
          this._done = true;
          this.hint.setVisible(true);
        }
      },
    });
  }

  _advanceOrSkip() {
    if (!this._done) {
      if (this._typeTimer) this._typeTimer.remove();
      this._typeTimer = null;
      this._i = this._full.length;
      this.bodyText.setText(this._full);
      this._done = true;
      this.hint.setVisible(true);
      return;
    }
    const cb = this._onDoneCb;
    this._onDoneCb = null;
    if (cb) cb();
  }

  waitForAdvance() {
    return new Promise((resolve) => {
      const check = () => {
        if (this._done) {
          resolve();
        } else {
          this.scene.time.delayedCall(50, check);
        }
      };
      const originalDone = this._onDoneCb;
      this._onDoneCb = () => {
        if (originalDone) originalDone();
        resolve();
      };
    });
  }

  hide() {
    this.container.setVisible(false);
    if (this._typeTimer) this._typeTimer.remove();
    this._typeTimer = null;
  }

  destroy() {
    this.container.destroy();
  }
}
