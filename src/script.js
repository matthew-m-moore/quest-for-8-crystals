// The tutorial arc, adapted beat-for-beat from James's storyboard
// ("The quest for the 8 crystals to save the universe").
// Step types: bg, sprite, removeSprite, clear, say, wait, choice, battle, reward, shop, end

// Dev-only jump points, so a specific scene can be replayed without
// clicking through everything before it. See CLAUDE.md "Debug checkpoints".
export const CHECKPOINTS = [
  { marker: 'cp_bluestar', label: 'Land on Bluestar' },
  { marker: 'cp_bounty', label: 'Bounty board' },
  { marker: 'afterBounty', label: 'Mage encounter' },
  { marker: 'cp_goliath', label: 'Goliath' },
  { marker: 'cp_graveyard', label: 'Graveyard fork' },
  { marker: 'kingIntro', label: 'Swordsman king' },
  { marker: 'cp_shop', label: 'Shop' },
  { marker: 'cp_finalboss', label: 'Final boss' },
];

export const tutorialScript = [
  { type: 'bg', sky: '#ffffff', ground: null },
  { type: 'say', speaker: '', text: '20 minutes ago...' },

  { type: 'bg', sky: '#00ffff', ground: '#00ff00' },
  { type: 'sprite', id: 'hero', texture: 'hero_face', x: 220, y: 360, scale: 1 },
  { type: 'say', speaker: 'You', text: 'hmm?' },
  { type: 'sprite', id: 'sign', texture: 'sign_board', x: 720, y: 330, scale: 1 },
  { type: 'say', speaker: '', text: 'WARNING: the universe is ending in 48 hours!' },
  { type: 'say', speaker: 'You', text: "...well, someone's gotta do something about that." },
  { type: 'removeSprite', id: 'sign' },

  // A first, impulsive rocket trip -- straight into witnessing the universe
  // actually end. Too late to stop it; this is what sends him looking for
  // another way (the 8 crystals) instead.
  { type: 'removeSprite', id: 'hero' },
  { type: 'sprite', id: 'rocket2', texture: 'rocket', x: 700, y: 300, scale: 0.9 },
  { type: 'wait', ms: 300 },
  { type: 'sprite', id: 'flame2', texture: 'flame', x: 700, y: 420, scale: 0.9 },
  { type: 'wait', ms: 400 },
  { type: 'sprite', id: 'rocket2', texture: 'rocket', x: 700, y: -300, scale: 0.9, duration: 900 },
  { type: 'removeSprite', id: 'flame2' },
  { type: 'removeSprite', id: 'rocket2' },

  { type: 'bg', sky: '#050014', ground: null, stars: true },
  { type: 'wait', ms: 700 },
  { type: 'sprite', id: 'boom', texture: 'explosion_burst', x: 480, y: 260, scale: 0.2 },
  { type: 'wait', ms: 150 },
  { type: 'sprite', id: 'boom', texture: 'explosion_burst', x: 480, y: 260, scale: 2.4, duration: 350 },
  { type: 'wait', ms: 800 },
  { type: 'removeSprite', id: 'boom' },

  { type: 'bg', sky: '#00ffff', ground: '#8b5a2b', blackstar: true },
  { type: 'sprite', id: 'hero', texture: 'hero_face', x: 320, y: 420, scale: 1 },
  { type: 'say', speaker: 'You', text: '...' },
  { type: 'say', speaker: 'You', text: "It already happened. I'm too late." },
  { type: 'say', speaker: 'You', text: "*sigh* At least some of the stars made it." },

  { type: 'say', speaker: '', text: 'Meanwhile, across town...' },
  { type: 'clear' },
  { type: 'bg', sky: '#00ffff', ground: '#8b5a2b', blackstar: true },
  {
    type: 'sprite', id: 'n1', texture: 'shopkeeper', x: 300, y: 380, scale: 1,
    overlays: [{ type: 'image', texture: 'mug', dx: 55, dy: 8, scale: 1 }],
  },
  {
    type: 'sprite', id: 'n2', texture: 'shopkeeper', x: 660, y: 380, scale: 1,
    overlays: [{ type: 'image', texture: 'tattoo_mark', dx: 48, dy: -30, scale: 0.9 }],
  },
  { type: 'say', speaker: 'Neighbor', text: 'How does it look?' },
  { type: 'say', speaker: 'Friend', text: "Seems fine for now, most of the stars survived. Also — what's that on your face?" },
  { type: 'say', speaker: 'Neighbor', text: 'Oh, this is my new tattoo. Do you like it?' },
  { type: 'say', speaker: 'Friend', text: 'Where did you get that?' },
  { type: 'say', speaker: 'Neighbor', text: "Oh, there's a tattoo place over there." },
  { type: 'say', speaker: 'Friend', text: "...there's a lot going through my head right now. I'm very confused." },
  { type: 'say', speaker: 'Neighbor', text: 'Ok, bye.' },
  { type: 'say', speaker: 'Friend', text: '*sigh* I wish there was a way to bring back the universe.' },
  { type: 'say', speaker: '???', text: 'Oh, there is a way. Do you want to know it?' },
  { type: 'say', speaker: 'Friend', text: 'Huh, who said that?' },
  { type: 'clear' },

  { type: 'bg', sky: '#ffffff', ground: null, blackstar: true },
  { type: 'sprite', id: 'shop', texture: 'shop_stand', x: 700, y: 330, scale: 1 },
  {
    type: 'sprite', id: 'hero', texture: 'hero_face', x: 220, y: 400, scale: 1,
    overlays: [{ type: 'image', texture: 'mug', dx: 60, dy: 5, scale: 1 }],
  },
  { type: 'say', speaker: 'Shopkeeper', text: "Me! Also, hello — I'm the shopkeeper." },
  { type: 'say', speaker: 'You', text: 'Oh, can you tell me how?' },
  { type: 'say', speaker: 'Shopkeeper', text: "Ok, but it's a dangerous mission." },
  { type: 'say', speaker: 'You', text: "I don't care." },
  { type: 'removeSprite', id: 'hero' },
  { type: 'sprite', id: 'hero', texture: 'hero', x: 220, y: 400, scale: 1 },
  { type: 'say', speaker: 'Shopkeeper', text: "Ok, you're serious about this. You must find the 8 crystals of the universe. But I only know the location of one, so good luck finding the others." },
  { type: 'say', speaker: 'You', text: 'Ok, where is it?' },
  { type: 'say', speaker: 'Shopkeeper', text: "Just go to that spaceship over there, and I'll type in the coordinates." },
  { type: 'clear' },

  { type: 'bg', sky: '#ffffff', ground: null, blackstar: true },
  { type: 'sprite', id: 'rocket', texture: 'rocket', x: 480, y: 300, scale: 1 },
  { type: 'say', speaker: '', text: '3... 2... 1... liftoff!' },
  { type: 'sprite', id: 'flame', texture: 'flame', x: 480, y: 430, scale: 1 },
  { type: 'wait', ms: 400 },
  { type: 'launchRocket' },

  { type: 'bg', sky: '#050014', ground: null, stars: true, blackstar: true },
  { type: 'sprite', id: 'rocket', texture: 'rocket', x: 480, y: 270, scale: 0.9 },
  { type: 'say', speaker: 'You', text: 'So far so good...' },
  { type: 'say', speaker: 'You', text: 'Uh oh.' },
  { type: 'say', speaker: 'You', text: "I'm gonna crash!!!" },
  { type: 'crashRocket' },

  { type: 'bg', sky: '#00ffff', ground: '#00ffff', blackstar: true, marker: 'cp_bluestar' },
  { type: 'sprite', id: 'wreck', texture: 'rocket', x: 220, y: 460, scale: 0.55, angle: 100 },
  {
    type: 'sprite', id: 'sign', texture: 'sign_board', x: 740, y: 320, scale: 1,
    overlays: [
      {
        type: 'text', text: 'Welcome to\nPlanet Bluestar', dx: 0, dy: -25,
        fontSize: '16px', color: '#0a6e77', align: 'center', wrapWidth: 190,
      },
    ],
  },
  { type: 'sprite', id: 'hero', texture: 'hero', x: 400, y: 420, scale: 1 },
  { type: 'say', speaker: 'You', text: 'ugh... where am I?' },
  { type: 'say', speaker: 'You', text: 'Oh.' },
  { type: 'say', speaker: 'You', text: 'I need to find materials to repair the ship.' },

  { type: 'sprite', id: 'grunt', texture: 'grunt', x: 700, y: 400, scale: 1.1 },
  { type: 'say', speaker: '???', text: "Gasp — it's a human!" },
  { type: 'say', speaker: 'You', text: 'Uh oh.' },
  { type: 'battle', enemies: ['grunt'], canRun: false },
  { type: 'reward', money: 4 },
  { type: 'sprite', id: 'grunt', texture: 'grunt_ko', x: 700, y: 400, scale: 1.1 },
  { type: 'say', speaker: 'You', text: 'Nice — think I have the hang of this now.' },
  { type: 'clear', marker: 'cp_bounty' },

  { type: 'sprite', id: 'ladder', texture: 'ladder', x: 210, y: 300, scale: 0.9 },
  { type: 'sprite', id: 'longrock', texture: 'longrock', x: 700, y: 150, scale: 1, angle: -6 },
  {
    type: 'sprite', id: 'poster', texture: 'sign_board', x: 700, y: 340, scale: 1.15,
    overlays: [
      { type: 'text', text: 'WANTED', dx: 0, dy: -55, fontSize: '20px', color: '#661111', fontStyle: 'bold' },
      { type: 'image', texture: 'hero_face', dx: 0, dy: -3, scale: 0.5 },
      { type: 'text', text: '1000z', dx: 0, dy: 25, fontSize: '18px', color: '#222222', fontStyle: 'bold' },
    ],
  },
  { type: 'sprite', id: 'g1', texture: 'grunt', x: 640, y: 440, scale: 1 },
  { type: 'sprite', id: 'g2', texture: 'grunt', x: 720, y: 440, scale: 1 },
  { type: 'say', speaker: 'Grunt', text: "That's him! We need that 1000 zoogels!" },
  { type: 'say', speaker: 'You', text: "Wait... that's a wanted poster of ME?!" },
  {
    type: 'choice',
    text: 'How do you want to deal with them?',
    options: [
      { label: 'Climb the ladder and push the rock down on them', flag: 'ladder' },
      { label: "Use the old dead guy's body as a distraction", flag: 'distraction' },
    ],
  },
  { type: 'gotoIf', flag: 'ladder', skipTo: 'ladderOutcome' },

  { type: 'say', speaker: 'You', text: "This feels wrong, but... sorry, old friend. You're a distraction now." },
  { type: 'clear' },
  {
    type: 'battle', enemies: ['bountyGrunt', 'grunt', 'grunt'], canRun: false,
    intro: 'The distraction worked... mostly. Here they come!',
  },
  { type: 'reward', money: 8 },
  { type: 'goto', marker: 'afterBounty' },

  { type: 'say', marker: 'ladderOutcome', speaker: 'You', text: 'Alright — up the ladder, and...' },
  { type: 'sprite', id: 'longrock', texture: 'longrock', x: 700, y: 430, scale: 1, angle: 4, duration: 450 },
  { type: 'say', speaker: '', text: "TIMBER! Turns out that rock was way longer than it looked — it flattens the guards before they even see it coming." },
  { type: 'removeSprite', id: 'longrock' },
  { type: 'removeSprite', id: 'g1' },
  { type: 'removeSprite', id: 'g2' },
  { type: 'reward', money: 8 },

  { type: 'clear', marker: 'afterBounty' },

  { type: 'sprite', id: 'mage', texture: 'mage', x: 700, y: 380, scale: 1 },
  { type: 'sprite', id: 'hero', texture: 'hero', x: 220, y: 420, scale: 1 },
  { type: 'say', speaker: 'Mysterious Mage', text: 'I have been expecting you.' },
  { type: 'say', speaker: 'Mysterious Mage', text: 'So you want to fight?' },
  { type: 'say', speaker: 'You', text: 'Yeah, bring it on!' },
  {
    type: 'battle', enemies: ['mage'], canRun: false,
    trophy: { title: 'A-MAGE-IN', subtitle: 'Defeat the mage' },
  },
  { type: 'sprite', id: 'mage', texture: 'mage_ko', x: 700, y: 380, scale: 1 },
  { type: 'say', speaker: 'You', text: 'Ooo — he dropped his staff!' },
  { type: 'reward', money: 5, item: 'staff', maxHpUp: 1 },
  { type: 'removeSprite', id: 'hero' },
  { type: 'sprite', id: 'hero', texture: 'hero_staff', x: 220, y: 420, scale: 1 },
  { type: 'say', speaker: '', text: 'Staff collected! You feel your magic grow stronger — and a bit tougher too.' },

  { type: 'clear', marker: 'cp_goliath' },
  { type: 'sprite', id: 'goliath', texture: 'goliath', x: 700, y: 360, scale: 1 },
  { type: 'sprite', id: 'hero', texture: 'hero_staff', x: 220, y: 420, scale: 1 },
  { type: 'say', speaker: 'Goliath', text: 'Ye shall not PASS.' },
  {
    type: 'battle', enemies: ['goliath'], canRun: false,
    trophy: { title: 'GOODBYE, GOLIATH', subtitle: 'Defeat Goliath' },
  },
  { type: 'reward', money: 5 },

  { type: 'clear', marker: 'cp_graveyard' },
  {
    type: 'sprite', id: 'sign1', texture: 'sign_board', x: 620, y: 330, scale: 0.9,
    overlays: [{
      type: 'text', text: 'Warning\nhaunted\ngraveyard', dx: 0, dy: -10,
      fontSize: '15px', color: '#661111', align: 'center', wrapWidth: 190,
    }],
  },
  {
    type: 'sprite', id: 'sign2', texture: 'sign_board', x: 860, y: 330, scale: 0.9,
    overlays: [{
      type: 'text', text: 'Enter if\nyou dare', dx: 0, dy: -10,
      fontSize: '16px', color: '#333333', align: 'center', wrapWidth: 190,
    }],
  },
  {
    type: 'choice',
    text: 'A dark path forks off toward the graveyard. Enter?',
    options: [
      { label: 'Enter if you dare', flag: 'enteredGraveyard' },
      { label: 'Stick to the main road', flag: 'skippedGraveyard' },
    ],
  },

  { type: 'gotoIf', flag: 'skippedGraveyard', skipTo: 'kingIntro' },

  { type: 'say', speaker: 'You', text: 'Umm... I probably should not go here.' },
  { type: 'clear' },
  { type: 'sprite', id: 'h1', texture: 'hood1', x: 640, y: 420, scale: 1 },
  { type: 'sprite', id: 'h2', texture: 'hood2', x: 720, y: 420, scale: 1 },
  { type: 'sprite', id: 'h3', texture: 'hood3', x: 800, y: 420, scale: 1 },
  { type: 'say', speaker: '???', text: 'Hehe, we are the Mysterious Gang.' },
  {
    type: 'battle', enemies: ['hood1', 'hood2', 'hood3'], canRun: false,
    trophy: { title: 'MYSTERIOUS DEFEAT', subtitle: 'Defeat the mysterious gang' },
  },
  { type: 'reward', money: 6 },

  { type: 'clear' },
  { type: 'sprite', id: 't1', texture: 'tombstone', x: 260, y: 440, scale: 1 },
  { type: 'sprite', id: 't2', texture: 'tombstone', x: 820, y: 440, scale: 1 },
  { type: 'sprite', id: 'hero', texture: 'hero_staff', x: 540, y: 420, scale: 1 },
  { type: 'say', speaker: 'You', text: "I'm scared." },
  { type: 'sprite', id: 'cord', texture: 'cord', x: 540, y: 140, scale: 1 },
  { type: 'sprite', id: 'ghost', texture: 'ghost', x: 540, y: 230, scale: 1 },
  { type: 'say', speaker: '', text: 'Woooo...' },
  { type: 'say', speaker: 'You', text: 'wait...' },
  { type: 'removeSprite', id: 'cord' },
  { type: 'sprite', id: 'ghost', texture: 'ghost', x: 610, y: 470, scale: 1, angle: 80, duration: 300 },
  { type: 'say', speaker: 'You', text: 'bruh.' },
  { type: 'say', speaker: '', text: "The cord snapped. That 'ghost' was just hanging decoration." },
  { type: 'say', speaker: 'You', text: 'Brr — why is it so cold?' },
  { type: 'sprite', id: 'breath', texture: 'breath_cloud', x: 575, y: 385, scale: 1 },
  { type: 'say', speaker: 'You', text: 'I can see my breath...' },
  { type: 'removeSprite', id: 'breath' },
  { type: 'say', speaker: 'You', text: '...and that was the last of the warm air.' },

  { type: 'clear', marker: 'kingIntro' },
  { type: 'sprite', id: 'king', texture: 'king', x: 700, y: 380, scale: 1 },
  { type: 'sprite', id: 'hero', texture: 'hero_staff', x: 220, y: 420, scale: 1 },
  { type: 'say', speaker: 'Swordsman King', text: 'You will pay for everything you take.' },
  { type: 'say', speaker: 'You', text: 'Time to dethrone this king!' },
  {
    type: 'battle', enemies: ['king'], canRun: false,
    trophy: { title: 'DUAL-FEATED', subtitle: 'Defeat the swordsman' },
  },
  { type: 'reward', money: 8 },

  { type: 'clear', marker: 'cp_shop' },
  { type: 'sprite', id: 'stand', texture: 'shop_stand', x: 700, y: 330, scale: 1 },
  { type: 'sprite', id: 'hero', texture: 'hero_staff', x: 220, y: 420, scale: 1 },
  { type: 'say', speaker: 'Shopkeeper', text: 'Huh, why are you here?' },
  { type: 'say', speaker: 'Shopkeeper', text: 'To sell you stuff that will help you on your journey.' },
  { type: 'shop' },
  { type: 'say', speaker: 'Shopkeeper', text: 'Good luck.' },

  { type: 'clear', marker: 'cp_finalboss' },
  { type: 'sprite', id: 'starboss', texture: 'star_boss', x: 700, y: 330, scale: 1 },
  { type: 'sprite', id: 'hero', texture: 'hero_staff', x: 220, y: 440, scale: 1 },
  { type: 'say', speaker: 'The Star', text: 'Grrr — you killed all my minions, but still I remain! Ahahahah!' },
  {
    type: 'battle', enemies: ['starBoss'], canRun: false,
    trophy: { title: 'DETHRONE', subtitle: 'Complete the tutorial' },
  },
  { type: 'reward', money: 10 },

  { type: 'clear' },
  { type: 'bg', sky: '#ffffff', ground: null },
  { type: 'end' },
];

export function markerIndex(marker) {
  return tutorialScript.findIndex((s) => s.marker === marker);
}
