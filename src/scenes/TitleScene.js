import { GameState } from '../state.js';
import { CHECKPOINTS, markerIndex } from '../script.js';

function jumpTo(scene, index) {
  GameState.reset();
  GameState.addMoney(30);
  GameState.heal();
  scene.scene.start('Story', { index });
}

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.cameras.main.setBackgroundColor('#ffffff');

    const urlStart = new URLSearchParams(window.location.search).get('start');
    if (urlStart) {
      const idx = markerIndex(urlStart);
      if (idx >= 0) return jumpTo(this, idx);
    }

    this.add.text(w / 2, 110, 'The Quest for the 8 Crystals', {
      fontSize: '40px', fontStyle: 'bold', color: '#111111',
    }).setOrigin(0.5);
    this.add.text(w / 2, 160, 'to Save the Universe', {
      fontSize: '32px', color: '#111111',
    }).setOrigin(0.5);
    this.add.text(w / 2, 200, 'a game by James', {
      fontSize: '18px', fontStyle: 'italic', color: '#666666',
    }).setOrigin(0.5);

    this.add.image(w / 2 - 200, h / 2 + 40, 'hero').setScale(1.1);
    this.add.image(w / 2 + 160, h / 2 + 60, 'grunt').setScale(1.3);
    this.add.image(w / 2 + 260, h / 2 + 60, 'goliath').setScale(0.55);

    const startBtn = this.add.text(w / 2, h - 90, '▶  Start Adventure', {
      fontSize: '28px', fontStyle: 'bold', color: '#ffffff',
      backgroundColor: '#22aa22', padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#2ecc2e' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#22aa22' }));
    startBtn.on('pointerdown', () => {
      GameState.reset();
      this.scene.start('Story', { index: 0 });
    });

    this.buildDebugPanel(w, h);
  }

  buildDebugPanel(w, h) {
    const panel = this.add.container(0, 0).setVisible(false);
    CHECKPOINTS.forEach((cp, i) => {
      const idx = markerIndex(cp.marker);
      if (idx < 0) return;
      const col = i % 2;
      const row = Math.floor(i / 2);
      const btn = this.add.text(24 + col * 240, 30 + row * 28, `▶ ${cp.label}`, {
        fontSize: '13px', color: '#2266cc',
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setColor('#4488ee'));
      btn.on('pointerout', () => btn.setColor('#2266cc'));
      btn.on('pointerdown', () => jumpTo(this, idx));
      panel.add(btn);
    });

    const toggle = this.add.text(w - 16, h - 16, 'debug', {
      fontSize: '12px', color: '#bbbbbb',
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    toggle.on('pointerdown', () => panel.setVisible(!panel.visible));
  }
}
