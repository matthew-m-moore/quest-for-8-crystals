const DEFAULTS = {
  hp: 5,
  maxHp: 5,
  money: 0,
  crystals: 0,
  flags: {},
};

export const GameState = {
  ...structuredClone(DEFAULTS),

  reset() {
    Object.assign(this, structuredClone(DEFAULTS));
  },

  heal() {
    this.hp = this.maxHp;
  },

  growMaxHp(amount) {
    this.maxHp += amount;
    this.hp = this.maxHp;
  },

  addMoney(amount) {
    this.money = Math.max(0, this.money + amount);
  },

  setFlag(name, value = true) {
    this.flags[name] = value;
  },

  hasFlag(name) {
    return !!this.flags[name];
  },
};
