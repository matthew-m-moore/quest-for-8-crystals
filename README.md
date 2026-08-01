# The Quest for the 8 Crystals to Save the Universe

A turn-based RPG, in the spirit of Paper Mario, based on a storyboard James made in Google Slides.

You have 48 hours to find the 8 crystals of the universe. So far you know the location of one.

## Play

Open `index.html` through a local web server (double-clicking it won't work — ES modules require `http://`, not `file://`):

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

Or just play the live version on GitHub Pages (see the repo's "About" section for the link once deployed).

## How it plays

- Click/tap through the story, same as reading a comic.
- Occasionally you'll get to choose how to handle a situation.
- In battle: **Attack** and **Special Attack** both use a timing bar — press SPACE (or click) when the marker crosses the target zone for bonus damage, Paper-Mario-action-command style. Defending works the same way when an enemy attacks you.
- Land enough basic attacks to fully charge your Special Attack for a big hit.
- Earn zoogels (z) from battles, and spend them at the shop.

## Tech

Plain JavaScript (ES modules) + [Phaser 3](https://phaser.io) loaded from a CDN — no build step, no npm install. Deploys straight to GitHub Pages via the included Actions workflow.

- `src/gfx.js` — all sprites, drawn in code to match James's flat-shape storyboard art
- `src/script.js` — the story script (the tutorial arc, adapted from the storyboard)
- `src/scenes/StoryScene.js` — interprets the story script (dialogue, choices, cutscenes)
- `src/scenes/BattleScene.js` — the combat engine

This covers the tutorial arc from the storyboard (crash-landing on Planet Bluestar through the "Complete the tutorial" trophy). The other 7 crystals are still out there — next up!
