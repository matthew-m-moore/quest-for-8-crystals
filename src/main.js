import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { StoryScene } from './scenes/StoryScene.js';
import { BattleScene } from './scenes/BattleScene.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, StoryScene, BattleScene],
});

// iOS Safari's collapsing address/tab bar changes the visible viewport
// without always firing a plain 'resize' — without this, the canvas can
// end up scaled to a taller-than-visible area and the bottom UI (e.g. the
// battle menu) gets cropped off-screen.
const refreshScale = () => game.scale.refresh();
window.addEventListener('resize', refreshScale);
window.addEventListener('orientationchange', refreshScale);
window.visualViewport?.addEventListener('resize', refreshScale);
