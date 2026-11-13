# Little Memory Club

A cheerful, responsive Memory Card Matching Game built with plain HTML, CSS, and JavaScript. Flip two cards at a time, remember what you see, and match every pair.

## Play locally

No package installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local web server, open a terminal in the project folder and run:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## How to play

- Choose Easy (6 pairs), Classic (8 pairs), or Expert (12 pairs).
- Select two cards to reveal them. Matching cards stay face up.
- Find every pair in as few moves as you can.
- Your best move count is saved in your browser for each difficulty.
- Use **New game** at any time to shuffle and restart.

## What this project teaches

- **HTML structure and accessibility:** semantic sections, labels, buttons, keyboard focus, and live announcements.
- **CSS layout and responsive design:** Grid, flexible sizing, breakpoints, card states, and transitions.
- **JavaScript DOM manipulation:** creating cards, updating counters, and reacting to clicks.
- **Game state:** tracking revealed cards, matches, moves, and turn locking.
- **Arrays and algorithms:** duplicating symbols and shuffling cards with Fisher–Yates.
- **Timers and browser storage:** measuring elapsed time with `setInterval` and remembering best scores with `localStorage`.

## Project files

- `index.html` — page structure and controls
- `style.css` — visual design, card animations, and responsive layout
- `script.js` — card generation, matching rules, timer, and best scores

The game uses no frameworks, image assets, or external game APIs. The display font is loaded from Google Fonts; system fonts are used as a fallback.
