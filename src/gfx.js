// Procedural sprite generation, styled after James's storyboard art:
// flat shapes, thin dark outlines, simple dot eyes, no gradients/shading.

function face(g, cx, cy, r, { fill, stroke = 0x333333, angry = false, closedHappy = false, defeated = false }) {
  g.lineStyle(4, stroke, 1);
  g.fillStyle(fill, 1);
  g.fillCircle(cx, cy, r);
  g.strokeCircle(cx, cy, r);

  const eyeDx = r * 0.32;
  const eyeDy = -r * 0.1;
  const eyeR = r * 0.09;

  if (defeated) {
    const s = r * 0.14;
    g.lineStyle(3, stroke, 1);
    [-1, 1].forEach((dir) => {
      const ex = cx + dir * eyeDx;
      const ey = cy + eyeDy;
      g.lineBetween(ex - s, ey - s, ex + s, ey + s);
      g.lineBetween(ex - s, ey + s, ex + s, ey - s);
    });
    g.beginPath();
    g.arc(cx, cy + r * 0.5, r * 0.3, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
    g.strokePath();
    return;
  }

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

function lightningStaff(g, x, y, angle = 0, scale = 1) {
  g.save();
  g.translateCanvas(x, y);
  g.rotateCanvas(Phaser.Math.DegToRad(angle));
  g.scaleCanvas(scale, scale);
  g.lineStyle(5, 0x555555, 1);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -70);
  g.strokePath();
  g.lineStyle(4, 0x998800, 1);
  g.fillStyle(0xffee00, 1);
  g.beginPath();
  g.moveTo(-6, -70);
  g.lineTo(14, -115);
  g.lineTo(0, -115);
  g.lineTo(16, -160);
  g.lineTo(-14, -110);
  g.lineTo(0, -110);
  g.closePath();
  g.fillPath();
  g.strokePath();
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

function spikyBurst(g, cx, cy, outerR, innerR, fill, points = 12) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = Phaser.Math.DegToRad((360 / (points * 2)) * i);
    pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  g.fillStyle(fill, 1);
  g.beginPath();
  g.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
  g.closePath();
  g.fillPath();
}

function cloudPuff(g, cx, cy, fill, alpha = 1) {
  g.fillStyle(fill, alpha);
  g.fillCircle(cx - 14, cy + 4, 12);
  g.fillCircle(cx, cy - 4, 14);
  g.fillCircle(cx + 14, cy + 4, 11);
  g.fillRect(cx - 14, cy, 28, 12);
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

  make('hero_face', 110, 110, () => {
    face(g, 55, 55, 46, { fill: 0xeaeaea });
  });

  make('hero_staff', 240, 200, () => {
    face(g, 115, 85, 46, { fill: 0xeaeaea });
    sword(g, 178, 148, 25, 1);
    staff(g, 32, 190, -12, 0.85);
  });

  make('grunt', 110, 110, () => {
    face(g, 55, 55, 46, { fill: 0x22cc22, angry: true });
  });

  make('grunt_ko', 110, 110, () => {
    face(g, 55, 55, 46, { fill: 0x22cc22, defeated: true });
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

  make('mage_ko', 150, 190, () => {
    face(g, 65, 110, 46, { fill: 0x22cc22, defeated: true });
    g.lineStyle(4, 0x5a00b3, 1);
    g.fillStyle(0x9b30ff, 1);
    g.fillTriangle(65, 8, 20, 78, 110, 78);
    g.strokeTriangle(65, 8, 20, 78, 110, 78);
    g.fillStyle(0xffff00, 1);
    [[45, 40], [70, 55], [85, 35], [55, 65]].forEach(([sx, sy]) => {
      star5(g, sx, sy, 6, 3, 0xffff00, 0xd4c400);
    });
  });

  make('goliath', 190, 210, () => {
    face(g, 115, 110, 60, { fill: 0x22cc22, angry: true });
    lightningStaff(g, 35, 200, -12, 1.1);
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
      if (i === 0) {
        g.fillStyle(0x4499ff, 1);
        g.fillTriangle(55, 26, 43, 46, 67, 46);
        g.fillTriangle(55, 66, 43, 46, 67, 46);
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

  make('king', 200, 230, () => {
    face(g, 75, 130, 48, { fill: 0x22cc22, angry: true });
    sword(g, 150, 200, -20, 2.0);
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

  make('explosion_burst', 300, 220, () => {
    spikyBurst(g, 150, 110, 150, 60, 0xff2200);
    spikyBurst(g, 150, 110, 110, 45, 0xff9900);
    spikyBurst(g, 150, 110, 70, 30, 0xffee00);
  });

  make('black_star_icon', 50, 50, () => {
    star5(g, 25, 25, 22, 9, 0x000000, 0x000000);
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

  make('longrock', 900, 110, () => {
    g.lineStyle(4, 0x444444, 1);
    g.fillStyle(0x6e6e6e, 1);
    g.fillRect(0, 0, 900, 110);
    g.strokeRect(0, 0, 900, 110);
    g.lineStyle(2, 0x555555, 0.6);
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 70;
      g.lineBetween(x, 10, x + 20, 100);
    }
  });

  make('mug', 50, 54, () => {
    g.lineStyle(3, 0x333333, 1);
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 10, 28, 34);
    g.strokeRect(6, 10, 28, 34);
    g.fillStyle(0x6b3d1a, 1);
    g.fillRect(9, 13, 22, 8);
    g.lineStyle(3, 0x333333, 1);
    g.beginPath();
    g.arc(34, 27, 10, Phaser.Math.DegToRad(-70), Phaser.Math.DegToRad(70), false);
    g.strokePath();
  });

  make('tattoo_mark', 60, 60, () => {
    cloudPuff(g, 30, 26, 0xdddddd, 1);
    g.lineStyle(2, 0x888888, 1);
    g.strokeCircle(16, 30, 12);
    g.strokeCircle(30, 22, 14);
    g.strokeCircle(42, 30, 10);
    g.lineStyle(3, 0x333333, 1);
    g.fillStyle(0xffee00, 1);
    g.beginPath();
    g.moveTo(30, 36);
    g.lineTo(22, 50);
    g.lineTo(29, 50);
    g.lineTo(24, 60);
    g.lineTo(36, 46);
    g.lineTo(29, 46);
    g.closePath();
    g.fillPath();
    g.strokePath();
  });

  make('breath_cloud', 60, 44, () => {
    g.lineStyle(2, 0x999999, 0.8);
    cloudPuff(g, 30, 24, 0xdddddd, 0.9);
    g.strokeCircle(16, 28, 12);
    g.strokeCircle(30, 20, 14);
    g.strokeCircle(44, 28, 11);
  });

  make('cord', 8, 160, () => {
    g.fillStyle(0x555555, 1);
    g.fillRect(2, 0, 4, 160);
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

  make('icon_sun', 40, 40, () => {
    g.fillStyle(0xffdd00, 1);
    g.fillCircle(20, 20, 10);
    g.lineStyle(3, 0xffaa00, 1);
    for (let i = 0; i < 8; i++) {
      const a = Phaser.Math.DegToRad(i * 45);
      g.lineBetween(20 + Math.cos(a) * 13, 20 + Math.sin(a) * 13, 20 + Math.cos(a) * 18, 20 + Math.sin(a) * 18);
    }
  });

  make('icon_lightning', 40, 40, () => {
    g.lineStyle(2, 0x998800, 1);
    g.fillStyle(0xffee00, 1);
    g.beginPath();
    g.moveTo(22, 2);
    g.lineTo(10, 22);
    g.lineTo(18, 22);
    g.lineTo(14, 38);
    g.lineTo(30, 16);
    g.lineTo(22, 16);
    g.closePath();
    g.fillPath();
    g.strokePath();
  });

  make('icon_moon', 40, 40, () => {
    g.fillStyle(0xaaaaaa, 1);
    g.fillCircle(20, 20, 15);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(27, 16, 14);
  });

  make('icon_water', 40, 40, () => {
    g.lineStyle(2, 0x0077aa, 1);
    g.fillStyle(0x22bbee, 1);
    g.beginPath();
    g.moveTo(20, 4);
    g.arc(20, 24, 16, Phaser.Math.DegToRad(-125), Phaser.Math.DegToRad(125), false);
    g.closePath();
    g.fillPath();
    g.strokePath();
  });

  make('icon_heart', 40, 40, () => {
    g.fillStyle(0x111111, 1);
    g.fillTriangle(4, 16, 36, 16, 20, 38);
    g.fillCircle(13, 15, 11);
    g.fillCircle(27, 15, 11);
  });

  make('icon_log', 40, 40, () => {
    g.lineStyle(2, 0x4a2f18, 1);
    g.fillStyle(0x8b5a2b, 1);
    g.fillRoundedRect(4, 12, 32, 16, 8);
    g.strokeRoundedRect(4, 12, 32, 16, 8);
    g.fillStyle(0xd2a679, 1);
    g.fillEllipse(6, 20, 6, 9);
    g.strokeEllipse(6, 20, 6, 9);
  });

  make('icon_noentry', 40, 40, () => {
    g.lineStyle(4, 0xcc0000, 1);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(20, 20, 16);
    g.strokeCircle(20, 20, 16);
    g.lineBetween(8, 20, 32, 20);
  });

  make('icon_explosion', 40, 40, () => {
    g.fillStyle(0xff9900, 1);
    spikyBurst(g, 20, 20, 18, 8, 0xff9900, 8);
  });

  g.destroy();
}
