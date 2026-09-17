# LuckyRealms

LuckyRealms is a browser-based virtual slot casino built with HTML, CSS and vanilla JavaScript.

The project features multiple themed slot machines powered by a shared reusable slot engine, while each game keeps its own visual identity, symbol probabilities, payouts, bonus mechanics, sound effects, background music and statistics.

LuckyRealms uses virtual credits only. No real-money gambling is involved.

## Live Demo

[Play LuckyRealms](https://gmihalev404.github.io/LuckyRealms/)

## Games

### Dragon's Fortune 🐉

A fantasy-themed slot with higher volatility, rare high-value symbols and Dragon Egg bonus symbols.

Dragon's Fortune features a fantasy-inspired visual theme, themed sound effects and its own background soundtrack.

### Poseidon's Treasure 🔱

An ocean-themed slot with more balanced symbol distribution and steadier payouts.

Poseidon's Treasure uses an underwater visual style together with lighter aquatic sound effects and a unique ocean-themed soundtrack.

### Shadow Fortune 💀

A dark high-volatility slot focused on rarer wins and larger possible payouts.

Shadow Fortune features a darker visual identity, lower and more atmospheric sound effects and its own dark background soundtrack.

## Features

- 5×3 slot grid
- 5 active paylines
- Weighted random symbols
- Different payouts and volatility per game
- Shared virtual credit balance
- Separate statistics for each slot machine
- Win highlighting
- Payline win breakdown
- Bonus symbols
- Free spins
- Theme-specific sound effects
- Unique background music for every realm
- Separate SFX and music controls
- Adjustable master volume
- Persistent audio preferences
- Persistent game data using `localStorage`
- Responsive layout
- Individual visual themes for every realm
- Dynamically generated game cards
- Shared generic slot engine

## Architecture

The slot machines share one reusable engine:

```text
                 GAME_CONFIGS
                /     |      \
          Dragon   Poseidon   Shadow
               \      |      /
                  slots.js
               generic engine

                    ↓

                 home.js
          generates game cards
```

Game-specific behavior is defined inside `game-configs.js`.

The shared `slots.js` engine handles:

- reel generation
- paylines
- win detection
- payouts
- bonus symbols
- free spins
- game statistics
- balance management
- slot animations

Audio is handled separately by `sound.js`, which provides:

- game-specific sound effects
- background music
- SFX controls
- music controls
- volume management

This architecture makes it possible to add new slot machines without duplicating the core slot logic.

## Project Structure

```text
LuckyRealms/
├── index.html
├── games/
│   └── slots.html
├── css/
│   ├── style.css
│   └── slots.css
├── js/
│   ├── app.js
│   ├── home.js
│   ├── game-configs.js
│   ├── sound.js
│   └── slots.js
├── assets/
│   ├── audio/
│   │   ├── dragon-theme.mp3
│   │   ├── poseidon-theme.mp3
│   │   └── shadow-theme.mp3
│   └── screenshots/
│       ├── home1.jpg
│       ├── home2.jpg
│       ├── dragon.jpg
│       ├── ocean.jpg
│       └── shadow.jpg
├── architecture.txt
└── README.md
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Web Audio API
- HTML5 Audio
- Web Storage API (`localStorage`)
- Git
- GitHub
- GitHub Pages

No frameworks or external JavaScript libraries are required.

## Running the Project

Clone the repository:

```bash
git clone https://github.com/gmihalev404/LuckyRealms.git
```

Open the project folder and launch `index.html` in a browser.

For development, using the VS Code Live Server extension is recommended.

The deployed version is also available through GitHub Pages:

[https://gmihalev404.github.io/LuckyRealms/](https://gmihalev404.github.io/LuckyRealms/)

## Game Data

Each game defines its own:

- symbols
- symbol weights
- payout multipliers
- bonus symbol
- number of awarded free spins
- visual theme
- statistics storage key

The shared slot engine reads the selected game's configuration dynamically.

Each realm therefore uses the same underlying game engine while still providing a different gameplay feel and visual identity.

## Paylines and Wins

LuckyRealms uses five active paylines across a 5×3 grid.

A winning combination requires at least three consecutive identical symbols on the same payline.

Winning sequences may contain:

- 3 matching symbols
- 4 matching symbols
- 5 matching symbols

Longer matching sequences receive larger rewards.

The total bet is divided across all active paylines before the symbol multiplier is applied.

Bonus symbols are handled separately and do not count as normal payline wins.

## Bonus Symbols and Free Spins

Each realm contains its own bonus symbol.

When enough bonus symbols appear anywhere on the 5×3 grid, the player receives free spins.

Free spins:

- do not consume credits
- use the current bet value
- can still produce normal payline wins
- can trigger additional free spins

Available free spins are stored separately for every game.

## Audio

Each realm has its own background soundtrack and themed sound effects.

The shared audio system handles:

- spin sound effects
- reel stop sounds
- win sounds
- bonus sounds
- looping realm-specific background music
- independent SFX and music toggles
- master volume control

Background music starts after the first user interaction because modern browsers restrict automatic audio playback.

Turning the music off pauses the current soundtrack. Turning it back on continues playback from the same position.

Audio preferences are preserved between sessions using `localStorage`.

Background music assets are used under the Pixabay Content License.

## Persistence

LuckyRealms uses browser `localStorage` to preserve:

- shared credit balance
- game statistics
- available free spins
- SFX preference
- music preference
- master volume

Because the project has no backend, this data is stored locally in the user's browser.

The shared balance is available across all three games, while game statistics and free spins are stored separately for each realm.

## Screenshots

### Home

![LuckyRealms Home](assets/screenshots/home1.jpg)

![LuckyRealms Home](assets/screenshots/home2.jpg)

### Dragon's Fortune

![Dragon's Fortune](assets/screenshots/dragon.jpg)

### Poseidon's Treasure

![Poseidon's Treasure](assets/screenshots/ocean.jpg)

### Shadow Fortune

![Shadow Fortune](assets/screenshots/shadow.jpg)

## Author

Georgi Mihalev
