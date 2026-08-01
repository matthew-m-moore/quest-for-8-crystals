import { registerTextures } from '../gfx.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    registerTextures(this);
    this.scene.start('Title');
  }
}
