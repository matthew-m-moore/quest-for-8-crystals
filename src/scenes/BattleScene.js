import { GameState } from '../state.js';
import { makeEnemyInstance } from '../enemies.js';
import { TimingBar } from '../ui/TimingBar.js';

export class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  init(data) {
    this.enemyKeys = data.enemyKeys;
    this.canRun = !!data.canRun;
    this.introText = data.introText || null;
    this.trophy = data.trophy || null;
    this.returnIndex = data.returnIndex;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x00e5ff).setDepth(-100);
    this.add.rectangle(w / 2, h - 60, w, 120, 0x0fb3cc).setDepth(-90);

    this.timingBar = new TimingBar(this);

    this.playerSprite = this.add.image(200, h - 190, 'hero').setScale(1.2);
    this.playerHpBar = this.makeBar(120, h - 300, 160);
    this.playerLabel = this.add.text(120, h - 320, '', { fontSize: '16px', color: '#111111', fontStyle: 'bold' });

    this.enemies = this.enemyKeys.map((key, i) => makeEnemyInstance(key));
    const n = this.enemies.length;
    const barWidth = n > 1 ? 90 : 110;
    this.enemies.forEach((en, i) => {
      const ex = w - 220 - (n - 1 - i) * 150;
      const ey = h - 200;
      en.sprite = this.add.image(ex, ey, en.texture).setScale(en.scale * (n > 1 ? 0.8 : 1));
      en.barX = ex;
      en.barY = ey - 120;
      en.bar = this.makeBar(en.barX - barWidth / 2, en.barY, barWidth);
      en.label = this.add.text(en.barX, en.barY - 18, '', {
        fontSize: n > 1 ? '12px' : '14px', color: '#111111', fontStyle: 'bold',
      }).setOrigin(0.5, 0);
    });

    this.menuTexts = {};
    this.specialCharge = 0;
    this.specialMax = 20;
    if (GameState.flags.nextBattleBonusCharge) {
      this.specialCharge = 5;
      GameState.flags.nextBattleBonusCharge = false;
    }

    this.buildMenu();
    this.refreshBars();
    this.setMenuEnabled(false);

    this.runBattle();
  }

  makeBar(x, y, width) {
    const bg = this.add.rectangle(x, y, width, 16, 0x333333).setOrigin(0, 0.5);
    const fill = this.add.rectangle(x + 2, y, width - 4, 12, 0x33cc33).setOrigin(0, 0.5);
    fill.maxWidth = width - 4;
    return { bg, fill };
  }

  setBar(bar, ratio) {
    bar.fill.width = Math.max(0, bar.fill.maxWidth * Phaser.Math.Clamp(ratio, 0, 1));
    bar.fill.fillColor = ratio > 0.5 ? 0x33cc33 : ratio > 0.2 ? 0xdddd22 : 0xdd3322;
  }

  refreshBars() {
    this.setBar(this.playerHpBar, GameState.hp / GameState.maxHp);
    this.playerLabel.setText(`You  ${GameState.hp}/${GameState.maxHp}`);
    this.enemies.forEach((en) => {
      if (!en.alive) {
        en.bar.bg.setVisible(false);
        en.bar.fill.setVisible(false);
        en.label.setVisible(false);
        return;
      }
      this.setBar(en.bar, en.hp / en.hpMax);
      en.label.setText(`${en.name}  ${en.hp}/${en.hpMax}`);
    });
  }

  buildMenu() {
    const h = this.scale.height;
    const specText = () => `Special (${this.specialCharge}/${this.specialMax})`;

    this.attackBtn = this.makeMenuButton(90, h - 60, 'Attack', () => this.playerAction('attack'));
    this.specialBtn = this.makeMenuButton(260, h - 60, specText(), () => this.playerAction('special'));
    this.runBtn = this.makeMenuButton(460, h - 60, 'Run', () => this.playerAction('run'));

    this.specTextFn = specText;
  }

  makeMenuButton(x, y, label, onClick) {
    const btn = this.add.text(x, y, label, {
      fontSize: '20px', fontStyle: 'bold', color: '#ffffff',
      backgroundColor: '#2266cc', padding: { x: 16, y: 10 },
    }).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => { if (btn.input.enabled) btn.setStyle({ backgroundColor: '#3377dd' }); });
    btn.on('pointerout', () => { if (btn.input.enabled) btn.setStyle({ backgroundColor: '#2266cc' }); });
    btn.on('pointerdown', () => { if (btn.input.enabled) onClick(); });
    return btn;
  }

  setMenuEnabled(enabled) {
    const canSpecial = enabled && this.specialCharge >= this.specialMax;
    const canRunNow = enabled && this.canRun;

    this.attackBtn.input.enabled = enabled;
    this.specialBtn.input.enabled = canSpecial;
    this.runBtn.input.enabled = canRunNow;

    this.attackBtn.setAlpha(enabled ? 1 : 0.5);
    this.specialBtn.setAlpha(canSpecial ? 1 : 0.4);
    this.specialBtn.setText(this.specTextFn());
    this.runBtn.setAlpha(canRunNow ? 1 : 0.4);
  }

  toast(text, { x, y, color = '#ffffff', size = '26px' } = {}) {
    const tx = x ?? this.scale.width / 2;
    const ty = y ?? this.scale.height / 2 - 60;
    const t = this.add.text(tx, ty, text, {
      fontSize: size, fontStyle: 'bold', color, stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(1500);
    return new Promise((resolve) => {
      this.tweens.add({
        targets: t, y: ty - 50, alpha: 0, duration: 850, ease: 'Cubic.easeOut',
        onComplete: () => { t.destroy(); resolve(); },
      });
    });
  }

  waitClick() {
    return new Promise((resolve) => {
      this.input.once('pointerdown', resolve);
      this.input.keyboard?.once('keydown-SPACE', resolve);
    });
  }

  async runBattle() {
    if (this.introText) {
      await this.toast(this.introText, { size: '22px', y: this.scale.height / 2 - 120 });
      await new Promise((r) => this.time.delayedCall(400, r));
    }

    while (true) {
      const aliveEnemies = this.enemies.filter((e) => e.alive);
      if (aliveEnemies.length === 0) return this.onVictory();
      if (GameState.hp <= 0) {
        GameState.hp = 1;
        await this.toast('That was close!', { color: '#ff8800' });
      }

      this.setMenuEnabled(true);
      const action = await new Promise((resolve) => {
        this._resolveAction = resolve;
      });
      this.setMenuEnabled(false);

      if (action === 'run') {
        await this.toast('You got away safely!', { color: '#88ccff' });
        return this.finishBattle();
      }

      const target = this.enemies.find((e) => e.alive);
      if (action === 'attack' || action === 'special') {
        const isSpecial = action === 'special';
        const quality = await this.timingBar.run({
          label: isSpecial ? 'SPECIAL ATTACK! Press SPACE!' : 'Press SPACE to attack!',
        });
        const base = isSpecial ? Phaser.Math.Between(4, 6) : Phaser.Math.Between(1, 2);
        const mult = quality === 'perfect' ? 2 : quality === 'good' ? 1 : 0.5;
        const dmg = Math.max(1, Math.round(base * mult));

        target.hp = Math.max(0, target.hp - dmg);
        this.refreshBars();
        this.bump(target.sprite);
        const qLabel = quality === 'perfect' ? 'PERFECT!' : quality === 'good' ? 'Nice!' : 'Missed the timing...';
        await this.toast(`${qLabel}  -${dmg} HP`, {
          x: target.sprite.x, y: target.sprite.y - 100, color: quality === 'miss' ? '#cccccc' : '#ffcc00', size: '22px',
        });

        if (isSpecial) {
          this.specialCharge = 0;
        } else {
          this.specialCharge = Math.min(this.specialMax, this.specialCharge + 3);
        }

        if (target.hp <= 0) {
          target.alive = false;
          this.refreshBars();
          await this.toast(`${target.name} defeated!`, { x: target.sprite.x, color: '#33ff66' });
          this.tweens.add({ targets: target.sprite, alpha: 0, y: target.sprite.y + 30, duration: 400 });
        }
      }

      const stillAlive = this.enemies.filter((e) => e.alive);
      if (stillAlive.length === 0) return this.onVictory();

      const attacker = Phaser.Utils.Array.GetRandom(stillAlive);
      const guardQuality = await this.timingBar.run({ label: `${attacker.name} attacks! Press SPACE to guard!`, speedMs: 650 });
      const rawDmg = Phaser.Math.Between(attacker.atkMin, attacker.atkMax);
      const guardMult = guardQuality === 'perfect' ? 0 : guardQuality === 'good' ? 0.5 : 1;
      const dmgTaken = Math.round(rawDmg * guardMult);

      GameState.hp = Math.max(0, GameState.hp - dmgTaken);
      this.refreshBars();
      this.bump(this.playerSprite);
      const gLabel = guardQuality === 'perfect' ? 'Perfect guard!' : guardQuality === 'good' ? 'Partial block!' : 'Ouch!';
      await this.toast(`${gLabel}  -${dmgTaken} HP`, {
        x: this.playerSprite.x, y: this.playerSprite.y - 130, color: dmgTaken === 0 ? '#33ff66' : '#ff5555', size: '20px',
      });
    }
  }

  bump(sprite) {
    this.tweens.add({ targets: sprite, x: sprite.x + 12, duration: 60, yoyo: true, repeat: 2 });
  }

  playerAction(action) {
    if (this._resolveAction) {
      const resolve = this._resolveAction;
      this._resolveAction = null;
      resolve(action);
    }
  }

  async onVictory() {
    if (this.trophy) {
      await this.showTrophy(this.trophy);
    } else {
      await this.toast('Victory!', { size: '30px', color: '#33ff66' });
    }
    this.finishBattle();
  }

  showTrophy({ title, subtitle }) {
    return new Promise((resolve) => {
      const w = this.scale.width;
      const h = this.scale.height;
      const panel = this.add.rectangle(w / 2, h / 2, 520, 220, 0xffffff, 0.98).setStrokeStyle(5, 0xffcc00).setDepth(1600);
      const trophyTitle = this.add.text(w / 2, h / 2 - 40, `\u{1F3C6} ${title}`, {
        fontSize: '30px', fontStyle: 'bold', color: '#8a5a00',
      }).setOrigin(0.5).setDepth(1601);
      const trophySub = this.add.text(w / 2, h / 2 + 10, subtitle, {
        fontSize: '18px', color: '#333333',
      }).setOrigin(0.5).setDepth(1601);
      const cont = this.add.text(w / 2, h / 2 + 65, 'Continue', {
        fontSize: '18px', color: '#ffffff', backgroundColor: '#22aa22', padding: { x: 16, y: 8 },
      }).setOrigin(0.5).setDepth(1601).setInteractive({ useHandCursor: true });
      cont.on('pointerdown', () => {
        panel.destroy(); trophyTitle.destroy(); trophySub.destroy(); cont.destroy();
        resolve();
      });
    });
  }

  finishBattle() {
    const story = this.scene.get('Story');
    this.scene.stop();
    story.resumeStory(this.returnIndex);
  }
}
