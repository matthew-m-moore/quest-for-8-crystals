// Procedural sprite generation, styled after James's storyboard art:
// flat shapes, thin dark outlines, simple dot eyes, no gradients/shading.

function face(g, cx, cy, r, { fill, stroke = 0x333333, angry = false, closedHappy = false }) {
  g.lineStyle(4, stroke, 1);
  g.fillStyle(fill, 1);
  g.fillCircle(cx, cy, r);
  g.strokeCircle(cx, cy, r);

  const eyeDx = r * 0.32;
  const eyeDy = -r * 0.1;
  const eyeR = r * 0.09;

  if (angry) {
    g.lineStyle(3, stroke, 1);
    g.beginPath();
    g.moveTo(cx - eyeDx - eyeR * 2, cy + eyeDy - eyeR * 2.2);
    g.lineTo(cx - eyeDx + eyeR, cy + eyeDy);
    g.moveTo(cx + eyeDx + eyeR * 2, cy + eyeDy - eyeR * 2.2);
    g.lineTo(cx + eyeDx - eyeR, cy + eyeDy);
    g.strokePath();
  }

  g.fillStyle(stroke, 1);
  g.fillCircle(cx - eyeDx, cy + eyeDy, eyeR);
  g.fillCircle(cx + eyeDx, cy + eyeDy, eyeR);

  g.lineStyle(3, stroke, 1);
  g.beginPath();
  if (closedHappy) {
    g.arc(cx, cy + r * 0.15, r * 0.4, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160), false);
  } else if (angry) {
    g.arc(cx, cy + r * 0.55, r * 0.35, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340), true);
  } else {
    g.arc(cx, cy + r * 0.15, r * 0.4, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160), false);
  }
  g.strokePath();
}

function sword(g, x, y, angle = -20, scale = 1) {
  g.save();
  g.translateCanvas(x, y);
  g.rotateCanvas(Phaser.Math.DegToRad(angle));
  g.scaleCanvas(scale, scale);
  g.lineStyle(3, 0x222222, 1);
  g.fillStyle(0xffffff, 1);
  g.fillTriangle(-14, 0, 14, 0, 0, -78);
  g.strokeTriangle(-14, 0, 14, 0, 0, -78);
  g.fillStyle(0x333333, 1);
  g.fillRect(-20, 0, 40, 8);
  g.fillRect(-6, 8, 12, 26);
  g.strokeRect(-20, 0, 40, 8);
  g.strokeRect(-6, 8, 12, 26);
  g.restore();
}

function staff(g, x, y, angle = -15, scale = 1) {
  g.save();
  g.translateCanvas(x, y);
  g.rotateCanvas(Phaser.Math.DegToRad(angle));
  g.scaleCanvas(scale, scale);
  g.lineStyle(6, 0x6b3d1a, 1);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -110);
  g.strokePath();
  g.lineStyle(4, 0x6b3d1a, 1);
  g.fillStyle(0x6b3d1a, 1);
  g.beginPath();
  g.arc(0, -110, 26, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(340), false);
  g.strokePath();
  g.fillStyle(0x33e6ff, 1);
  g.fillCircle(0, -118, 16);
  g.fillStyle(0x9b30ff, 1);
  g.fillCircle(0, -118, 8);
  g.restore();
}

function star5(g, cx, cy, outerR, innerR, fill, stroke) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = Phaser.Math.DegToRad(-90 + i * 36);
    points.push(new Phaser.Math.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
  }
  g.lineStyle(4, stroke, 1);
  g.fillStyle(fill, 1);
  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) g.lineTo(points[i].x, points[i].y);
  g.closePath();
  g.fillPath();
  g.strokePath();
}

export function registerTextures(scene) {
  const g = scene.add.graphics();
  const make = (key, w, h, drawFn) => {
    g.clear();
    drawFn();
    g.generateTexture(key, w, h);
  };

  make('hero', 180, 180, () => {
    face(g, 55, 75, 46, { fill: 0xeaeaea });
    sword(g, 118, 138, 25, 1);
  });

  make('grunt', 110, 110, () => {
    face(g, 55, 55, 46, { fill: 0x22cc22, angry: true });
  });

  make('mage', 150, 190, () => {
    face(g, 65, 110, 46, { fill: 0x22cc22 });
    g.lineStyle(4, 0x5a00b3, 1);
    g.fillStyle(0x9b30ff, 1);
    g.fillTriangle(65, 8, 20, 78, 110, 78);
    g.strokeTriangle(65, 8, 20, 78, 110, 78);
    g.fillStyle(0xffff00, 1);
    [[45, 40], [70, 55], [85, 35], [55, 65]].forEach(([sx, sy]) => {
      star5(g, sx, sy, 6, 3, 0xffff00, 0xd4c400);
    });
    staff(g, 120, 175, -10, 0.85);
  });

  make('goliath', 170, 190, () => {
    star5(g, 90, 100, 78, 32, 0x00e5ff, 0x008fa3);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(72, 95, 18, 26);
    g.fillEllipse(104, 95, 18, 26);
    g.lineStyle(5, 0x666666, 1);
    g.fillStyle(0xffee00, 1);
    g.beginPath();
    g.moveTo(20, 60);
    g.lineTo(35, 95);
    g.lineTo(20, 95);
    g.lineTo(38, 135);
    g.lineTo(28, 100);
    g.lineTo(43, 100);
    g.closePath();
    g.fillPath();
    g.strokePath();
  });

  make('star_boss', 260, 260, () => {
    star5(g, 130, 130, 118, 48, 0x00e5ff, 0x007c8f);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(105, 122, 24, 34);
    g.fillEllipse(150, 122, 24, 34);
    g.fillStyle(0xffff00, 1);
    star5(g, 220, 50, 14, 6, 0xffff00, 0xd4c400);
    g.fillStyle(0x9b30ff, 1);
    star5(g, 205, 210, 12, 5, 0x9b30ff, 0x6a1fb3);
    g.lineStyle(5, 0x888888, 1);
    g.beginPath();
    g.arc(45, 150, 20, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), false);
    g.strokePath();
  });

  ['hood1', 'hood2', 'hood3'].forEach((key, i) => {
    make(key, 110, 130, () => {
      face(g, 55, 78, 42, { fill: 0x33bb55 });
      g.lineStyle(4, 0x111111, 1);
      g.fillStyle(0x111111, 1);
      g.fillTriangle(55, 10, 8, 78, 102, 78);
      g.strokeTriangle(55, 10, 8, 78, 102, 78);
      if (i === 1) {
        g.fillStyle(0x4499ff, 1);
        g.fillTriangle(55, 35, 45, 50, 65, 50);
      }
    });
  });

  make('ghost', 140, 160, () => {
    g.lineStyle(3, 0x555555, 1);
    g.fillStyle(0xf0f0f0, 1);
    g.beginPath();
    g.arc(70, 70, 60, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
    g.lineTo(130, 130);
    for (let i = 0; i < 6; i++) {
      const x1 = 130 - i * (120 / 6);
      const x2 = x1 - 10;
      g.lineTo(x1 - 120 / 12, 145);
      g.lineTo(x2, 130);
    }
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.fillStyle(0x999999, 1);
    g.fillEllipse(50, 75, 12, 20);
    g.fillEllipse(90, 75, 12, 20);
    g.fillEllipse(70, 105, 22, 14);
  });

  make('king', 160, 190, () => {
    face(g, 65, 110, 48, { fill: 0x22cc22, angry: true });
    sword(g, 130, 175, -25, 1.3);
  });

  make('shopkeeper', 110, 110, () => {
    face(g, 55, 55, 46, { fill: 0xeaeaea, closedHappy: true });
  });

  make('rocket', 180, 240, () => {
    g.lineStyle(5, 0x555555, 1);
    g.fillStyle(0xffffff, 1);
    g.beginPath();
    g.moveTo(90, 0);
    g.lineTo(60, 90);
    g.lineTo(120, 90);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.fillRect(60, 90, 60, 110);
    g.strokeRect(60, 90, 60, 110);
    ['tri-l', 'tri-r'].forEach((_, i) => {
      const dir = i === 0 ? -1 : 1;
      g.beginPath();
      g.moveTo(90 + dir * 30, 60);
      g.lineTo(90 + dir * 30, 160);
      g.lineTo(90 + dir * 65, 200);
      g.closePath();
      g.fillPath();
      g.strokePath();
    });
    g.fillStyle(0xcfcfcf, 1);
    g.fillCircle(90, 130, 14);
    g.strokeCircle(90, 130, 14);
    g.fillCircle(90, 165, 12);
    g.strokeCircle(90, 165, 12);
  });

  make('flame', 100, 150, () => {
    g.fillStyle(0xff7700, 1);
    g.fillEllipse(50, 60, 40, 90);
    g.fillStyle(0xffcc00, 1);
    g.fillEllipse(50, 70, 20, 60);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(50, 90, 8, 30);
  });

  make('sign_board', 240, 170, () => {
    g.lineStyle(4, 0x333333, 1);
    g.fillStyle(0xeeeeee, 1);
    g.fillRect(10, 10, 220, 110);
    g.strokeRect(10, 10, 220, 110);
    g.fillStyle(0x8b5a2b, 1);
    g.fillRect(70, 120, 14, 50);
    g.fillRect(160, 120, 14, 50);
  });

  make('shop_stand', 320, 240, () => {
    g.fillStyle(0x8b5a2b, 1);
    g.fillRect(30, 130, 260, 100);
    g.fillRect(50, 30, 20, 130);
    g.fillRect(250, 30, 20, 130);
    g.fillStyle(0xff00ff, 1);
    g.lineStyle(3, 0xcc00cc, 1);
    g.beginPath();
    g.moveTo(10, 30);
    g.lineTo(310, 30);
    g.lineTo(280, 75);
    g.lineTo(40, 75);
    g.closePath();
    g.fillPath();
    g.strokePath();
    face(g, 165, 105, 42, { fill: 0xeaeaea, closedHappy: true });
  });

  make('tombstone', 110, 140, () => {
    g.lineStyle(3, 0x555555, 1);
    g.fillStyle(0xdddddd, 1);
    g.beginPath();
    g.moveTo(10, 140);
    g.lineTo(10, 45);
    g.arc(55, 45, 45, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
    g.lineTo(100, 140);
    g.closePath();
    g.fillPath();
    g.strokePath();
  });

  make('ladder', 90, 260, () => {
    g.fillStyle(0x8b5a2b, 1);
    g.fillRect(6, 0, 14, 260);
    g.fillRect(70, 0, 14, 260);
    g.fillStyle(0xffffff, 1);
    for (let y = 20; y < 260; y += 40) {
      g.fillRect(6, y, 78, 12);
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(6, y + 12, 78, 16);
      g.fillStyle(0xffffff, 1);
    }
  });

  make('rock', 90, 90, () => {
    g.lineStyle(3, 0x555555, 1);
    g.fillStyle(0x999999, 1);
    g.fillCircle(45, 50, 40);
    g.strokeCircle(45, 50, 40);
    g.lineStyle(2, 0x777777, 1);
    g.lineBetween(20, 40, 40, 55);
    g.lineBetween(50, 30, 60, 60);
  });

  make('potion_red', 46, 56, () => {
    g.fillStyle(0xd97a2b, 1);
    g.fillRect(16, 6, 14, 12);
    g.lineStyle(3, 0x882200, 1);
    g.fillStyle(0xff2222, 1);
    g.fillCircle(23, 38, 20);
    g.strokeCircle(23, 38, 20);
  });

  make('potion_cyan', 46, 56, () => {
    g.fillStyle(0xd97a2b, 1);
    g.fillRect(16, 6, 14, 12);
    g.lineStyle(3, 0x006677, 1);
    g.fillStyle(0x22e0ff, 1);
    g.fillCircle(23, 38, 20);
    g.strokeCircle(23, 38, 20);
  });

  make('heart_icon', 46, 42, () => {
    g.fillStyle(0xff2244, 1);
    g.fillTriangle(4, 16, 42, 16, 23, 40);
    g.fillCircle(14, 15, 12);
    g.fillCircle(32, 15, 12);
  });

  g.destroy();
}
