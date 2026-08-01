// A Paper Mario style "action command" timing prompt: a marker sweeps a bar,
// the player taps/presses SPACE when it's over the target zone.
export class TimingBar {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(1200);
    this.container.setVisible(false);
  }

  run({
    label = 'Press SPACE!', x, y, width = 320, speedMs = 850,
    minTargetW = 60, maxTargetW = 90, perfectRatio = 0.4,
  } = {}) {
    return new Promise((resolve) => {
      const scene = this.scene;
      const cx = x ?? scene.scale.width / 2;
      const cy = y ?? scene.scale.height / 2 - 40;
      const left = cx - width / 2;
      const right = cx + width / 2;

      const targetW = minTargetW + Math.random() * (maxTargetW - minTargetW);
      const targetX = left + targetW / 2 + Math.random() * (width - targetW);
      const perfectW = targetW * perfectRatio;

      const track = scene.add.rectangle(cx, cy, width, 22, 0x222222).setStrokeStyle(3, 0x000000);
      const target = scene.add.rectangle(targetX, cy, targetW, 22, 0xffee00, 0.85);
      const perfect = scene.add.rectangle(targetX, cy, perfectW, 22, 0x00cc44, 0.95);
      const marker = scene.add.rectangle(left, cy, 8, 34, 0xff2222);
      const labelText = scene.add.text(cx, cy - 40, label, {
        fontSize: '20px', fontStyle: 'bold', color: '#ffffff',
        stroke: '#000000', strokeThickness: 4,
      }).setOrigin(0.5);

      this.container.add([track, target, perfect, marker, labelText]);
      this.container.setVisible(true);

      let resolved = false;
      const finish = (quality) => {
        if (resolved) return;
        resolved = true;
        tween.remove();
        scene.input.keyboard?.off('keydown-SPACE', onPress);
        scene.input.off('pointerdown', onPress);
        this.container.removeAll(true);
        this.container.setVisible(false);
        resolve(quality);
      };

      const onPress = () => {
        const mx = marker.x;
        let quality = 'miss';
        if (Math.abs(mx - targetX) <= perfectW / 2) quality = 'perfect';
        else if (Math.abs(mx - targetX) <= targetW / 2) quality = 'good';
        finish(quality);
      };

      const tween = scene.tweens.add({
        targets: marker,
        x: { from: left, to: right },
        duration: speedMs,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      scene.time.delayedCall(4000, () => finish('miss'));

      scene.input.keyboard?.on('keydown-SPACE', onPress);
      scene.input.on('pointerdown', onPress);
    });
  }
}
