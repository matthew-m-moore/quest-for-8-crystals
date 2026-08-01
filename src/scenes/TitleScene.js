import { GameState } from '../state.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.cameras.main.setBackgroundColor('#ffffff');

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
  }
}
