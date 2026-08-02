import { GameState } from '../state.js';
import { makeEnemyInstance } from '../enemies.js';
import { TimingBar } from '../ui/TimingBar.js';

const SPELLS = [
  { key: 'sun', texture: 'icon_sun', name: 'Fireball', dmg: [6, 8], target: 'single' },
  { key: 'lightning', texture: 'icon_lightning', name: 'Lightning', dmg: [5, 7], target: 'single', stun: true },
  { key: 'moon', texture: 'icon_moon', name: 'Drain', dmg: [4, 6], target: 'single', drain: true },
  { key: 'water', texture: 'icon_water', name: 'Heal', heal: [5, 7], target: 'self' },
  { key: 'heart', texture: 'icon_heart', name: 'Full Heal', fullHeal: true, target: 'self' },
  { key: 'log', texture: 'icon_log', name: 'Guard', shield: true, target: 'self' },
  { key: 'noentry', texture: 'icon_noentry', name: 'Immunity', immune: 2, target: 'self' },
  { key: 'explosion', texture: 'icon_explosion', name: 'Explosion', dmg: [3, 5], target: 'all' },
];

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
    this.shieldActive = false;
    this.immuneCount = 0;

    const heroTexture = GameState.hasFlag('item_staff') ? 'hero_staff' : 'hero';
    this.playerSprite = this.add.image(200, h - 190, heroTexture).setScale(1.2);
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
    this.specialMax = 12;
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
    const specText = () => `${GameState.hasFlag('item_staff') ? 'Magic' : 'Special'} (${this.specialCharge}/${this.specialMax})`;

    this.attackBtn = this.makeMenuButton(90, h - 70, 'Attack', () => this.playerAction('attack'));
    this.specialBtn = this.makeMenuButton(280, h - 70, specText(), () => this.playerAction('special'));
    this.runBtn = this.makeMenuButton(480, h - 70, 'Run', () => this.playerAction('run'));

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

  pickSpell() {
    return new Promise((resolve) => {
      const w = this.scale.width;
      const h = this.scale.height;
      const created = [];
      const panel = this.add.rectangle(w / 2, h / 2, 480, 210, 0xffffff, 0.98).setStrokeStyle(4, 0x333333).setDepth(1600);
      const title = this.add.text(w / 2, h / 2 - 85, 'Choose a spell', {
        fontSize: '18px', fontStyle: 'bold', color: '#333333',
      }).setOrigin(0.5).setDepth(1601);
      created.push(panel, title);

      const cleanup = () => created.forEach((o) => o.destroy());

      SPELLS.forEach((sp, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = w / 2 - 150 + col * 100;
        const y = h / 2 - 15 + row * 75;
        const bg = this.add.rectangle(x, y, 56, 56, 0xf0f0f0).setStrokeStyle(2, 0x999999).setDepth(1600.5);
        const icon = this.add.image(x, y - 6, sp.texture).setScale(1.1).setDepth(1601);
        const label = this.add.text(x, y + 22, sp.name, {
          fontSize: '10px', color: '#333333',
        }).setOrigin(0.5).setDepth(1601);
        const zone = this.add.zone(x, y, 60, 70).setInteractive({ useHandCursor: true }).setDepth(1602);
        zone.on('pointerdown', () => { cleanup(); resolve(sp); });
        created.push(bg, icon, label, zone);
      });
    });
  }

  async applySpell(sp, quality, primaryTarget) {
    const mult = quality === 'perfect' ? 1.3 : quality === 'good' ? 1 : 0.7;

    if (sp.target === 'self') {
      if (sp.fullHeal) {
        GameState.heal();
        await this.toast('Fully healed!', { color: '#33ff66' });
      } else if (sp.heal) {
        const amt = Math.round(Phaser.Math.Between(sp.heal[0], sp.heal[1]) * mult);
        GameState.hp = Math.min(GameState.maxHp, GameState.hp + amt);
        await this.toast(`+${amt} HP`, { color: '#33ff66' });
      } else if (sp.shield) {
        this.shieldActive = true;
        await this.toast('Shield up!', { color: '#88ccff' });
      } else if (sp.immune) {
        this.immuneCount = sp.immune;
        await this.toast('Immunity!', { color: '#88ccff' });
      }
      this.refreshBars();
      return;
    }

    const targets = sp.target === 'all' ? this.enemies.filter((e) => e.alive) : [primaryTarget];
    for (const t of targets) {
      const dmgMult = t.playerDmgMult ?? 1;
      const dmg = Math.max(1, Math.round(Phaser.Math.Between(sp.dmg[0], sp.dmg[1]) * mult * dmgMult));
      t.hp = Math.max(0, t.hp - dmg);
      this.bump(t.sprite);
      if (sp.drain) GameState.hp = Math.min(GameState.maxHp, GameState.hp + Math.round(dmg / 2));
      if (sp.stun) t.stunned = true;
      if (t.hp <= 0 && t.alive) {
        t.alive = false;
        this.tweens.add({ targets: t.sprite, alpha: 0, y: t.sprite.y + 30, duration: 400 });
      }
    }
    this.refreshBars();
    await this.toast(`${sp.name}!`, { color: '#ffcc00' });
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
        const useMagic = isSpecial && GameState.hasFlag('item_staff');

        if (useMagic) {
          const sp = await this.pickSpell();
          const quality = await this.timingBar.run({ label: `${sp.name}! Press SPACE!` });
          await this.applySpell(sp, quality, target);
          this.specialCharge = 0;
        } else {
          const quality = await this.timingBar.run({
            label: isSpecial ? 'SPECIAL ATTACK! Press SPACE!' : 'Press SPACE to attack!',
          });
          const base = isSpecial ? Phaser.Math.Between(4, 6) : Phaser.Math.Between(1, 2);
          const qualityMult = quality === 'perfect' ? 2 : quality === 'good' ? 1 : 0.5;
          const dmgMult = target.playerDmgMult ?? 1;
          const dmg = Math.max(1, Math.round(base * qualityMult * dmgMult));

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
      }

      const stillAlive = this.enemies.filter((e) => e.alive);
      if (stillAlive.length === 0) return this.onVictory();

      const availableAttackers = stillAlive.filter((e) => !e.stunned);
      const attacker = Phaser.Utils.Array.GetRandom(availableAttackers.length ? availableAttackers : stillAlive);
      stillAlive.forEach((e) => { e.stunned = false; });

      const attackerCasts = attacker.usesMagic && Math.random() < 0.4;
      const guardQuality = await this.timingBar.run({
        label: `${attacker.name} ${attackerCasts ? 'casts a spell' : 'attacks'}! Press SPACE to guard!`,
        speedMs: 900, minTargetW: 100, maxTargetW: 130, perfectRatio: 0.45,
      });
      const rawDmg = attackerCasts
        ? Phaser.Math.Between(attacker.atkMax + 2, attacker.atkMax + 5)
        : Phaser.Math.Between(attacker.atkMin, attacker.atkMax);

      let guardMult = guardQuality === 'perfect' ? 0 : guardQuality === 'good' ? 0.5 : 1;
      if (this.immuneCount > 0) {
        guardMult = 0;
        this.immuneCount--;
      } else if (this.shieldActive) {
        guardMult = 0;
        this.shieldActive = false;
      }
      const dmgTaken = Math.round(rawDmg * guardMult);

      GameState.hp = Math.max(0, GameState.hp - dmgTaken);
      this.refreshBars();

      if (dmgTaken === 0) {
        await this.toast('Missed!', {
          x: this.playerSprite.x, y: this.playerSprite.y - 130, color: '#33ff66', size: '20px',
        });
      } else {
        this.bump(this.playerSprite);
        const gLabel = guardQuality === 'good' ? 'Partial block!' : 'Ouch!';
        await this.toast(`${gLabel}  -${dmgTaken} HP`, {
          x: this.playerSprite.x, y: this.playerSprite.y - 130, color: '#ff5555', size: '20px',
        });
      }

      if (GameState.hp <= 0) return this.onDefeat();
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

  async onDefeat() {
    this.setMenuEnabled(false);
    await this.toast('You were defeated...', { size: '28px', color: '#ff4444' });
    await new Promise((resolve) => {
      const w = this.scale.width;
      const h = this.scale.height;
      const panel = this.add.rectangle(w / 2, h / 2, 420, 190, 0xffffff, 0.98).setStrokeStyle(5, 0xaa2222).setDepth(1600);
      const msg = this.add.text(w / 2, h / 2 - 45, 'You were defeated!', {
        fontSize: '24px', fontStyle: 'bold', color: '#aa2222',
      }).setOrigin(0.5).setDepth(1601);
      const sub = this.add.text(w / 2, h / 2 - 5, 'Want to give it another go?', {
        fontSize: '16px', color: '#555555',
      }).setOrigin(0.5).setDepth(1601);
      const retryBtn = this.add.text(w / 2, h / 2 + 55, 'Try Again', {
        fontSize: '20px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#2266cc', padding: { x: 18, y: 10 },
      }).setOrigin(0.5).setDepth(1601).setInteractive({ useHandCursor: true });
      retryBtn.on('pointerdown', () => {
        panel.destroy(); msg.destroy(); sub.destroy(); retryBtn.destroy();
        resolve();
      });
    });

    GameState.heal();
    this.scene.restart({
      enemyKeys: this.enemyKeys,
      canRun: this.canRun,
      introText: this.introText,
      trophy: this.trophy,
      returnIndex: this.returnIndex,
    });
  }

  finishBattle() {
    GameState.heal();
    const story = this.scene.get('Story');
    this.scene.stop();
    story.resumeStory(this.returnIndex);
  }
}
