# Driftbound v0.4 — source code handover

This is the complete current web-game source at commit `3e8ab7b068443cf6cdc1399ff992448ea0fb11c2`.
It is the source of the published slingshot/mobile update. The original project
files are unchanged. This guide and SOURCE_MANIFEST.json are added for handover.

## Current delivery status

The implementation is JavaScript + Three.js, with HTML/CSS controls. This package
is a browser game prototype. Android and iOS native projects, a Capacitor project,
Unity/Godot projects, signed APK/AAB/IPA files, and store submissions have not been
created. The mobile manifest adds home-screen presentation, not a native engine.

## Run the game locally

1. Extract this ZIP.
2. Open a terminal in the extracted `Driftbound-v0.4` folder.
3. Run a local HTTP server:

Windows (Python installed):
```powershell
py -m http.server 8080 --directory dist
```

macOS/Linux (Python installed):
```bash
python3 -m http.server 8080 --directory dist
```

4. Open http://localhost:8080 in a browser with WebGL 2 enabled.

Do not open index.html directly with file://; the game uses JavaScript modules.
No compilation or npm install is needed to play: the pinned Three.js runtime is
included in dist/vendor. Optional Google Fonts fall back to system fonts.

## Controls

- Choose Slingshot Start. Drag down and release to launch.
- Keyboard: hold/release Space at the slingshot; arrows or A/D to steer.
- Quick launch gives 75% launch power.
- Drag horizontally to steer. Tap Spin (or Space) while airborne.
- P/Escape pauses. Rotation/backgrounding also pauses safely.
- Sound and graphics settings are available in the pause menu.

## Source map

| File | Responsibility |
| --- | --- |
| dist/engine.mjs | Levels, course generation, launch/jump physics, collision, pickups |
| dist/scene.mjs | Procedural 3D riders and terrain, slingshot, camera, rendering |
| dist/game.mjs | Menus, touch/keyboard input, audio, game state, save orchestration |
| dist/profile.mjs | Wallet, rider purchases, unlocks, rewards, save migration |
| dist/index.html | Game UI markup |
| dist/style.css | Desktop/mobile styles and safe-area layout |
| dist/manifest.webmanifest and dist/icons | Mobile home-screen metadata and icons |
| dist/vendor | Bundled Three.js 0.180.0 runtime and its MIT license |
| tests | Automated gameplay, scene, input, and progression checks |
| README.md | Implemented features and known limitations |
| package.json and pnpm-lock.yaml | Development package metadata and dependency lock |

The 3D content is generated in scene.mjs. There are no separate FBX, Blender,
GLB, or character texture source files hidden elsewhere.

## Tests and dependencies

Node.js v24.19.0 was used for verification. From this folder:
```bash
npm test
```

The tests import the bundled runtime, so they also run without npm install.
If you want the development dependency installed, run `pnpm install --frozen-lockfile`
using pnpm, or `npm install` using npm (which will create an npm lockfile).

Tests verify game logic and construct scene graphs. UI tests use a DOM/renderer
stub. They do not prove actual browser rendering, phone frame rate, battery use,
or touch feel. Those still need real-device testing.

## State, services, and limitations

- Nine routes, six rider identities, slingshot starts, ramps, halfpipes, boosters,
  coins, diamonds, finish rewards, and a local rider shop are implemented.
- Browser localStorage stores progress under `driftbound.progress.v3`; existing
  v0.2 progress can migrate. Browser-to-installed-app save migration is not built.
- No backend, account service, cloud saves, multiplayer, advertising, analytics,
  real-money payments, or native store billing is included.
- Local currency is not protected against client-side editing.
- No offline service-worker cache is implemented.
- The deployment-specific .openai/hosting.json is included for completeness;
  it is not needed to run locally. Git history and node_modules are excluded.
- Preserve dist/vendor/THREE-LICENSE.txt when redistributing Three.js.

## Integrity

SOURCE_MANIFEST.json records the originating commit and SHA-256 checksum of each
included project file and this guide. The ZIP was validated before handover.
