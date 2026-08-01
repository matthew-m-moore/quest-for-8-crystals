# The Quest for the 8 Crystals — project notes

A turn-based RPG based on James's (age 10) Google Slides storyboard. Plain
JavaScript (ES modules) + Phaser 3 loaded from a CDN — no npm, no build step.
Deploys to GitHub Pages via `.github/workflows/deploy.yml` (Actions serves
the repo root directly, nothing to compile).

## Architecture

- `src/gfx.js` — every sprite is drawn in code (Phaser `Graphics` →
  `generateTexture`), styled to match James's storyboard: flat shapes, thin
  dark outlines, simple dot eyes. No external art files.
- `src/script.js` — the story is data: an array of steps (`bg`, `sprite`,
  `say`, `choice`, `battle`, `reward`, `shop`, `gotoIf`/`goto`, ...)
  interpreted sequentially by `StoryScene`. To add content, add steps here —
  you very rarely need to touch scene code.
- `src/scenes/StoryScene.js` — the script interpreter. Sprites are tracked by
  `id` in `this.sprites`; reusing an `id` in a later `sprite` step repositions
  the existing one instead of creating a new one (used for animations like
  the log falling on the bounty guards, or swapping a defeated enemy's
  texture in place).
- `src/scenes/BattleScene.js` — turn-based combat, launched as a Phaser
  overlay scene on top of `StoryScene` (which pauses and resumes rather than
  stopping, so battle can hand control back with `resumeStory(index)`).

## Debug checkpoints

Testing this game means clicking through the same intro dialogue over and
over to reach the scene you're actually working on — that gets old fast.
Two ways around it:

1. **URL param**: `index.html?start=<marker>` jumps straight to that point
   in the script (skips the title screen), with full HP and some starting
   money. Fastest option when iterating from the CLI/browser-automation.
2. **Title screen "debug" link** (bottom-right, easy to miss): reveals a
   button per checkpoint for the same jump, for manual poking-around.

Checkpoint markers are defined in `CHECKPOINTS` in `src/script.js` and map to
`marker: '...'` fields on steps (usually the `clear` step at the start of a
scene). When adding a new major scene/battle, add a marker + a `CHECKPOINTS`
entry for it — cheap to add, saves a lot of replaying later.

## Lessons learned this session

- **No Node/npm/Homebrew on this machine.** Don't assume a build toolchain
  exists — plain JS + CDN Phaser sidesteps that entirely and is simpler to
  deploy anyway (GitHub Pages just serves the files as-is).
- **GitHub Pages must be enabled (`gh api repos/:owner/:repo/pages -X POST
  -f build_type=workflow`) before the first Actions run** — pushing first
  gets you a failing run; enable Pages, then `gh workflow run deploy.yml` to
  retry.
- **`git push` needs `gh auth setup-git`** the first time in a session — the
  plain git credential helper isn't wired to the `gh` CLI token by default.
- **A texture's *geometric center* isn't necessarily its *visual* center.**
  The `hero` texture is 180×180 to leave room for the sword, so its center
  is well below-right of the actual face. Placing that texture as a small
  "portrait" overlay (e.g. on the wanted poster) put the sword, not the
  face, at the anchor point. Fix: make a dedicated crop/portrait texture
  (`hero_face`) instead of scaling down the full-body one.
- **Always click-test in a real browser before pushing** (this project uses
  the `claude-in-chrome` skill). Screenshot after every couple of clicks
  when timing is uncertain — batching many blind clicks in one call causes
  timing drift (typewriter-text completion races with click-to-advance) and
  wastes more time than it saves.
- **Screen-coordinate math**: the game canvas is 960×540 with Phaser's
  `Scale.FIT` — when clicking via browser automation, map screenshot pixel
  coordinates back to game coordinates (or just click near the center of
  large UI elements like the dialogue box, which tolerates some slop).
