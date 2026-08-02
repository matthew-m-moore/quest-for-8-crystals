import { GameState } from '../state.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { tutorialScript } from '../script.js';

const hexNum = (str) => Phaser.Display.Color.HexStringToColor(str).color;

export class StoryScene extends Phaser.Scene {
  constructor() {
    super('Story');
  }

  init(data) {
    this.index = data?.index ?? 0;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.sky = this.add.rectangle(w / 2, h / 2, w, h, 0xffffff).setDepth(-100);
    this.ground = this.add.rectangle(w / 2, h - 70, w, 140, 0x00ff00).setDepth(-90).setVisible(false);
    this.starLayer = this.add.container(0, 0).setDepth(-95);
    // The black star is a fixed background element that foreshadows Planet
    // Blackstar — present in most scenes once it's first spotted (see script.js).
    this.blackStar = this.add.image(w - 130, 110, 'black_star_icon').setDepth(-94).setVisible(false);
    this.sprites = {};
    this.dialogue = new DialogueBox(this);
    this.overlay = this.add.container(0, 0).setDepth(1400);

    this.hud = this.add.text(16, 16, '', {
      fontSize: '18px', color: '#111111', backgroundColor: '#ffffffcc', padding: { x: 8, y: 4 },
    }).setDepth(1500);
    this.updateHud();

    this.markers = {};
    tutorialScript.forEach((step, i) => {
      if (step.marker) this.markers[step.marker] = i;
    });

    this.runFrom(this.index);
  }

  updateHud() {
    this.hud.setText(`❤ ${GameState.hp}/${GameState.maxHp}    \u{1F4B0} ${GameState.money}z`);
  }

  resumeStory(nextIndex) {
    this.scene.resume();
    this.updateHud();
    this.runFrom(nextIndex);
  }

  async runFrom(startIndex) {
    let i = startIndex;
    while (i < tutorialScript.length) {
      this.index = i;
      const step = tutorialScript[i];
      const next = await this.execStep(step);
      if (next === 'STOP') return;
      i = typeof next === 'number' ? next : i + 1;
    }
  }

  execStep(step) {
    switch (step.type) {
      case 'bg': return this.stepBg(step);
      case 'sprite': return this.stepSprite(step);
      case 'removeSprite': return this.stepRemoveSprite(step);
      case 'clear': return this.stepClear();
      case 'say': return this.stepSay(step);
      case 'wait': return this.stepWait(step);
      case 'choice': return this.stepChoice(step);
      case 'battle': return this.stepBattle(step);
      case 'reward': return this.stepReward(step);
      case 'shop': return this.stepShop();
      case 'launchRocket': return this.stepLaunchRocket();
      case 'crashRocket': return this.stepCrashRocket();
      case 'gotoIf': return this.stepGotoIf(step);
      case 'goto': return this.stepGoto(step);
      case 'end': return this.stepEnd();
      default: return undefined;
    }
  }

  stepBg({ sky, ground, stars, blackstar }) {
    if (sky) this.sky.setFillStyle(hexNum(sky));
    if (ground) this.ground.setVisible(true).setFillStyle(hexNum(ground));
    else this.ground.setVisible(false);

    this.blackStar.setVisible(!!blackstar);

    this.starLayer.removeAll(true);
    if (stars) {
      for (let i = 0; i < 70; i++) {
        const dot = this.add.circle(
          Phaser.Math.Between(0, this.scale.width),
          Phaser.Math.Between(0, this.scale.height),
          Phaser.Math.Between(1, 2),
          0xffffff,
        );
        this.starLayer.add(dot);
      }
    }
  }

  // `overlays` lets a sprite carry baked-on decoration (e.g. text/portrait
  // painted onto a sign), positioned relative to the sprite's own center.
  // `depth` defaults below the dialogue box (1000); pass a higher value to
  // render a sprite in front of it (e.g. the graveyard ghost on its cord).
  stepSprite({ id, texture, x, y, scale = 1, flipX = false, angle = 0, duration = 180, depth = 0, overlays = [] }) {
    let obj = this.sprites[id];
    if (!obj) {
      const mainImage = this.add.image(0, 0, texture).setFlipX(flipX);
      obj = this.add.container(x, y, [mainImage]);
      obj.mainImage = mainImage;
      obj.angle = angle;
      obj.setDepth(depth);
      overlays.forEach((ov) => {
        if (ov.type === 'text') {
          const t = this.add.text(ov.dx || 0, ov.dy || 0, ov.text, {
            fontSize: ov.fontSize || '16px',
            fontStyle: ov.fontStyle || 'bold',
            color: ov.color || '#111111',
            align: ov.align || 'center',
            wordWrap: ov.wrapWidth ? { width: ov.wrapWidth } : undefined,
          }).setOrigin(0.5);
          obj.add(t);
        } else if (ov.type === 'image') {
          const oi = this.add.image(ov.dx || 0, ov.dy || 0, ov.texture).setScale(ov.scale || 1);
          obj.add(oi);
        }
      });
      obj.setScale(0.001);
      this.sprites[id] = obj;
      this.tweens.add({ targets: obj, scale, duration: 220, ease: 'Back.easeOut' });
    } else {
      obj.mainImage?.setTexture(texture);
      obj.setDepth(depth);
      this.tweens.add({ targets: obj, x, y, scale, angle, duration });
    }
  }

  stepRemoveSprite({ id }) {
    const img = this.sprites[id];
    if (img) {
      img.destroy();
      delete this.sprites[id];
    }
  }

  stepClear() {
    Object.values(this.sprites).forEach((img) => img.destroy());
    this.sprites = {};
    this.dialogue.hide();
  }

  async stepSay({ speaker = '', text }) {
    const resolved = typeof text === 'function' ? text(GameState.flags) : text;
    this.dialogue.say(resolved, { speaker });
    await this.dialogue.waitForAdvance();
  }

  stepWait({ ms }) {
    return new Promise((resolve) => this.time.delayedCall(ms, resolve));
  }

  stepChoice({ text, options }) {
    return new Promise((resolve) => {
      this.dialogue.hide();
      const w = this.scale.width;
      const h = this.scale.height;
      const panelH = 90 + options.length * 60;
      const panel = this.add.rectangle(w / 2, h / 2, w - 120, panelH, 0xffffff, 0.98).setStrokeStyle(4, 0x333333);
      const prompt = this.add.text(w / 2, h / 2 - panelH / 2 + 36, text, {
        fontSize: '22px', fontStyle: 'bold', color: '#111111', align: 'center',
        wordWrap: { width: w - 200 },
      }).setOrigin(0.5);
      this.overlay.add([panel, prompt]);

      const buttons = options.map((opt, i) => {
        const btn = this.add.text(w / 2, h / 2 - panelH / 2 + 90 + i * 56, opt.label, {
          fontSize: '19px', color: '#ffffff', backgroundColor: '#2266cc', padding: { x: 18, y: 10 },
          align: 'center', wordWrap: { width: w - 260 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377dd' }));
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2266cc' }));
        btn.on('pointerdown', () => {
          GameState.setFlag(opt.flag);
          this.overlay.removeAll(true);
          resolve();
        });
        this.overlay.add(btn);
        return btn;
      });
      void buttons;
    });
  }

  stepBattle({ enemies, canRun, intro, trophy }) {
    this.dialogue.hide();
    const introText = typeof intro === 'function' ? intro(GameState.flags) : intro;
    this.scene.launch('Battle', {
      enemyKeys: enemies,
      canRun: !!canRun,
      introText: introText || null,
      trophy: trophy || null,
      returnIndex: this.index + 1,
    });
    this.scene.pause();
    return 'STOP';
  }

  async stepReward({ money = 0, maxHpUp = 0, item }) {
    if (money) GameState.addMoney(money);
    if (maxHpUp) GameState.growMaxHp(maxHpUp);
    if (item) GameState.setFlag(`item_${item}`);
    this.updateHud();

    if (money) {
      const w = this.scale.width;
      const toast = this.add.text(w / 2, this.scale.height / 2, `+${money}z`, {
        fontSize: '32px', fontStyle: 'bold', color: '#ffcc00', stroke: '#000000', strokeThickness: 5,
      }).setOrigin(0.5).setDepth(1500);
      await new Promise((resolve) => {
        this.tweens.add({
          targets: toast, y: toast.y - 60, alpha: 0, duration: 900, ease: 'Cubic.easeOut',
          onComplete: () => { toast.destroy(); resolve(); },
        });
      });
    }
  }

  stepShop() {
    return new Promise((resolve) => {
      const w = this.scale.width;
      const h = this.scale.height;
      const items = [
        { key: 'heal', label: 'Health Potion', price: 5, texture: 'potion_red', desc: 'Fully heals you' },
        { key: 'charm', label: 'Lucky Charm', price: 6, texture: 'potion_cyan', desc: 'Head-start your next special attack' },
        { key: 'heart', label: 'Heart Container', price: 7, texture: 'heart_icon', desc: '+1 max HP, fully heals' },
      ];

      const panel = this.add.rectangle(w / 2, h / 2, w - 100, 320, 0xffffff, 0.98).setStrokeStyle(4, 0x333333);
      const title = this.add.text(w / 2, h / 2 - 140, 'Shop', {
        fontSize: '24px', fontStyle: 'bold', color: '#111111',
      }).setOrigin(0.5);
      this.overlay.add([panel, title]);

      const moneyLabel = this.add.text(w / 2, h / 2 - 105, '', {
        fontSize: '18px', color: '#555555',
      }).setOrigin(0.5);
      this.overlay.add(moneyLabel);
      const refreshMoney = () => moneyLabel.setText(`You have ${GameState.money}z`);
      refreshMoney();

      const rowY = h / 2 - 50;
      items.forEach((it, i) => {
        const x = w / 2 + (i - 1) * 230;
        const icon = this.add.image(x, rowY, it.texture).setScale(1.4);
        const label = this.add.text(x, rowY + 55, `${it.label}\n${it.desc}`, {
          fontSize: '14px', color: '#222222', align: 'center', wordWrap: { width: 190 },
        }).setOrigin(0.5);
        const buyBtn = this.add.text(x, rowY + 105, `Buy - ${it.price}z`, {
          fontSize: '16px', color: '#ffffff', backgroundColor: '#22aa22', padding: { x: 12, y: 6 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        buyBtn.on('pointerdown', () => {
          if (GameState.money < it.price) return;
          GameState.addMoney(-it.price);
          if (it.key === 'heal') GameState.heal();
          if (it.key === 'heart') GameState.growMaxHp(1);
          if (it.key === 'charm') GameState.setFlag('nextBattleBonusCharge', true);
          refreshMoney();
          this.updateHud();
        });
        this.overlay.add([icon, label, buyBtn]);
      });

      const leaveBtn = this.add.text(w / 2, h / 2 + 145, 'Leave Shop', {
        fontSize: '20px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#aa3322', padding: { x: 16, y: 10 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      leaveBtn.on('pointerdown', () => {
        this.overlay.removeAll(true);
        resolve();
      });
      this.overlay.add(leaveBtn);
    });
  }

  stepLaunchRocket() {
    return new Promise((resolve) => {
      const rocket = this.sprites.rocket;
      const flame = this.sprites.flame;
      this.tweens.add({
        targets: rocket, y: rocket.y - 500, duration: 1300, ease: 'Cubic.easeIn',
        onComplete: () => { rocket?.destroy(); delete this.sprites.rocket; resolve(); },
      });
      if (flame) {
        this.tweens.add({
          targets: flame, y: flame.y - 500, alpha: 0, duration: 1300, ease: 'Cubic.easeIn',
          onComplete: () => { flame?.destroy(); delete this.sprites.flame; },
        });
      }
    });
  }

  stepCrashRocket() {
    return new Promise((resolve) => {
      const rocket = this.sprites.rocket;
      this.cameras.main.shake(1300, 0.01);
      this.tweens.add({
        targets: rocket,
        y: this.scale.height + 200,
        angle: 200,
        duration: 1300,
        ease: 'Cubic.easeIn',
        onComplete: () => { rocket?.destroy(); delete this.sprites.rocket; resolve(); },
      });
    });
  }

  stepGotoIf({ flag, skipTo }) {
    if (GameState.hasFlag(flag) && this.markers[skipTo] !== undefined) {
      return this.markers[skipTo];
    }
    return undefined;
  }

  stepGoto({ marker }) {
    return this.markers[marker];
  }

  stepEnd() {
    this.dialogue.hide();
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.text(w / 2, h / 2 - 80, '\u{1F3C6} Tutorial Complete!', {
      fontSize: '34px', fontStyle: 'bold', color: '#111111',
    }).setOrigin(0.5).setDepth(1500);
    this.add.text(w / 2, h / 2 - 20, `You found 1 of the 8 crystals.\n7 more are scattered across the universe...`, {
      fontSize: '20px', color: '#333333', align: 'center',
    }).setOrigin(0.5).setDepth(1500);
    this.add.text(w / 2, h / 2 + 40, 'To be continued...', {
      fontSize: '18px', fontStyle: 'italic', color: '#666666',
    }).setOrigin(0.5).setDepth(1500);

    const again = this.add.text(w / 2, h / 2 + 110, 'Play Again', {
      fontSize: '22px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#22aa22', padding: { x: 18, y: 10 },
    }).setOrigin(0.5).setDepth(1500).setInteractive({ useHandCursor: true });
    again.on('pointerdown', () => {
      GameState.reset();
      this.scene.start('Title');
    });
    return 'STOP';
  }
}
