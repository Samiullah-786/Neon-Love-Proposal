# Just for You — Proposal Experience

A cinematic neon proposal page with magenta/cyan colours, a rotating 3D heart, parallax glass letter, three-question mini-story, original soundtrack and a thoughtful final choice.

## Included files

- `index.html` — accessible page structure
- `style.css` — responsive styling, cinematic scene, motion and reduced-motion support
- `script.js` — questions, answer reactions, controls and personalization
- `neon-romance.jpg` — neon rooftop background artwork
- `YAAD HAI NA.mp3` — soundtrack

Keep all files together. Open `index.html` in a modern browser. The soundtrack begins when the visitor taps **Open your little surprise** (a browser-allowed user gesture); the music button in the top-right can pause or resume it. If a browser blocks playback, use **Play our song** in the header.

## Personalize names

At the very top of `script.js`, change:

```js
const SETTINGS = { lovedOne: 'Jaan', sender: 'Sami' };
```

You can edit the three questions and their answer reactions in the `QUESTIONS` array below it. To change the track, replace `YAAD HAI NA.mp3` and update its filename in the `<audio>` tag in `index.html`.

## Notes

The final screen offers both **Haan, bilkul** and **Mujhe thora waqt chahiye**; either answer is handled kindly. Google Fonts load when online and have system-font fallbacks. Keep the MP3 and `neon-romance.jpg` beside `index.html` when deploying.

## GitHub Pages

Push all project files to the repository's `main` branch, then choose **Settings → Pages → Deploy from a branch → main → / (root) → Save**. The song and image must be included in the repository for them to load online.
