export const ENEMY_TYPES = {
  grunt: { name: 'Grunt', hp: 2, atkMin: 1, atkMax: 1, texture: 'grunt', scale: 1 },
  bountyGrunt: { name: 'Big Grunt', hp: 3, atkMin: 1, atkMax: 2, texture: 'grunt', scale: 1.1 },

  mage: { name: 'Mysterious Mage', hp: 8, atkMin: 1, atkMax: 3, texture: 'mage', scale: 1 },
  goliath: { name: 'Goliath', hp: 8, atkMin: 2, atkMax: 3, texture: 'goliath', scale: 1 },
  hood1: { name: 'Mysterious Gang', hp: 3, atkMin: 1, atkMax: 2, texture: 'hood1', scale: 1 },
  hood2: { name: 'Mysterious Gang', hp: 2, atkMin: 1, atkMax: 2, texture: 'hood2', scale: 1 },
  hood3: { name: 'Mysterious Gang', hp: 2, atkMin: 1, atkMax: 2, texture: 'hood3', scale: 1 },
  ghost: { name: 'Graveyard Ghost', hp: 4, atkMin: 1, atkMax: 2, texture: 'ghost', scale: 1 },
  king: { name: 'Swordsman King', hp: 9, atkMin: 2, atkMax: 3, texture: 'king', scale: 1 },
  starBoss: { name: 'The Star', hp: 13, atkMin: 2, atkMax: 4, texture: 'star_boss', scale: 1 },
};

export function makeEnemyInstance(typeKey) {
  const type = ENEMY_TYPES[typeKey];
  return { ...type, key: typeKey, hpMax: type.hp, hp: type.hp, alive: true };
}
