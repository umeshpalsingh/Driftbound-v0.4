# Driftbound — Slingshot & mobile update (v0.4)

A 3D browser arcade game built with a pinned, locally bundled Three.js 0.180.0 runtime. Native Android/iOS packaging is a later stage.

## Reference and mobile launch

This update follows the supplied portrait gameplay recording's interaction pattern: a two-post elastic slingshot, drag-down charging, release to accelerate, one-thumb steering, a clear chase view, and raised icy track sections. Driftbound keeps its own world, riders, campaign, and economy.

Every start, retry, and next level opens at the slingshot. Drag down 90–180 screen pixels (scaled to viewport height) for full power. Releasing below 12% cancels the pull. Hold/release Space on a keyboard, or use Quick launch for 75% power. Bands stretch in 3D, the sled moves back up to 4.5 m, and release starts at exactly that position. Power controls the opening speed surge, which decays into normal downhill speed; weak launches can still finish every level. The clock, pickups, and rewards stay inactive while aiming.

Touch controls preserve a single steering pointer while allowing the separate spin button. Lost capture, interrupted touches, backgrounding, and rotation cannot accidentally fire the launcher. Rotation pauses; ordinary mobile browser-toolbar resizing does not. A floating thumb guide shows steering input. Portrait framing, 44+ px interactive targets, safe-area insets, scrolling menus, and simplified HUD support phone use. New phone profiles default to performance graphics; saved graphics choices remain intact. Sound and graphics can also be changed from pause.

A web manifest and home-screen icons provide standalone presentation in supporting mobile browsers. This is a mobile web build, not a signed APK/AAB or iOS binary. No offline cache or cross-device save sync is implemented.

## Mountain campaign

Nine finite, sequentially unlocked routes: Frostpine Ridge (650 m), Glacier Pass (900 m), Sunset Summit (1,200 m), Cedar Switchbacks (1,100 m), Crystal Traverse (1,400 m), Ember Canyon (1,500 m), Moonlight Grove (1,600 m), Stormline Peak (1,750 m), and Crown Descent (2,000 m).

Each route mixes forest, slalom, chicane, ice, canyon, ridge, and/or dedicated big-air sections. Eleven ice/S-bend sections have a raised halfpipe cross-section with smooth entry/exit transitions. A dense track ribbon and rider bank angle follow the same surface as the physics. Frostpine introduces its first halfpipe in level one. Terrain, ropes, obstacles, collectibles, camera, rider, tracks, and finish arch share the curved course coordinate system. Broad blockers and edge obstacles prevent unattended edge bypasses. Jump sections reserve clear landing space.

## Movement and power-ups

- Pull down and release to launch, then drag to steer or use Left/Right / A/D. P / Escape pauses; R retries from results.
- Ramps raise the sled smoothly and launch with an upward velocity. Gravity is 18 game units/s². Typical large jumps reach approximately 6 m and last around 1.6 s; speed affects horizontal travel. Mid-air steering has inertia and reduced responsiveness.
- Tap SPIN or press Space before the apex to perform one 360. Landing after a completed spin grants 250 points and 5 coins.
- Near misses charge automatic boost and chain up to 5× score.
- M: coin magnet for 9 seconds. S: one-hit shield, expires after 15 seconds. >>: nitro for approximately 3 seconds, with capped extension. 2x: doubled coin pickup values for 9 seconds.
- Shields consume on impact and briefly prevent repeated collisions from the same encounter. Magnets attract coins only, not rare diamonds.

## Currency and wardrobe

Coin lines lead between openings and through airborne arcs. Coins are repeatable. Diamond locations are rare aerial finds, permanently claimed once per route/location. A first route clear grants 2 diamonds and 80–200 coins; a first three-medal finish grants one additional diamond. Repeat clears grant 25 bonus coins. Medals require a finish, the displayed score goal, and eight near misses.

Six riders have distinct meshes/accessories, not only changed colours. All use the same gameplay handling.

| Rider | Identity | Cost |
|---|---|---|
| Maya | Expedition shell, utility pockets, trail pack | Starter |
| Kai | Teal parka, cream beanie, rolled sleeping mat | 300 coins |
| Nova | Racing shell, mohawk helmet, protective knee pads | 500 coins + 3 diamonds |
| Sora | Tech suit, luminous piping, wide visor | 750 coins + 6 diamonds |
| Atlas | Fur collar, rescue patches, cargo pockets, rope kit | 950 coins + 8 diamonds |
| Rune | Long violet coat, gold shoulder plates, split scarf | 1,300 coins + 12 diamonds |

Purchases use earned game currency only. Previewing a locked rider does not equip or purchase it. Insufficient-funds purchases are rejected. Owned riders can be equipped without another charge.

Loot is banked once on finish, crash, restart, or return to basecamp. Reloading in the middle of a run loses unbanked loot. Currency, owned riders, collected rare locations, and level records persist in this browser when localStorage is available. This is a local prototype economy, not server-authoritative or synchronized across devices.

Existing v0.2 progress migrates without removing levels or riders: Maya, Kai, and Nova remain owned for returning profiles, and previous completion rewards are marked already claimed. The old save key is left intact.

## Rendering

PBR materials, snow grain, atmospheric skies/fog, directional soft shadows, detailed procedural firs, sculpted rocks, tracks, snow spray, animated seated riders, and collectible effects. Forest and canyon sections add scenery. Long scenery is partitioned into 150 m batches for frustum culling. Performance mode disables shadows and reduces render resolution.

WebGL 2 and hardware graphics acceleration are required. Optional Google Fonts have system fallbacks; all runtime JavaScript is bundled locally. `dist/vendor/THREE-LICENSE.txt` contains the MIT license.

## Development and verification

Serve `dist` over HTTP. No build step is needed. `engine.mjs` owns game physics and course generation; `profile.mjs` owns rewards, migration, and purchases; `scene.mjs` owns 3D rendering; `game.mjs` owns UI and input.

Run `npm test` (or each Node test file individually). Checks cover:

- 72 completed routes across all nine levels (96.8 km), 144 corner-bypass regressions, stationary-lane exploits, and 120 jumps.
- Continuous ramp launch, gravity/landing, spin rewards, swept collision, shields, boost expiry, coin magnet/double combination, and rare pickup behavior.
- Purchases, insufficient funds, duplicate settlement, replay reward farming, crash loot, save/reload, and v0.2 migration.
- All nine scene graphs, all six outfit swaps, finite geometry/transforms, and curved finish alignment.
- Slingshot idle/launch/cancel guards, continuous release positions, speed impulse decay, 27 production-seed route completions at three launch powers, 54 additional edge checks, and eleven continuous banked sections.
- The actual UI input handlers at 320×568, 390×844, 430×932, and 844×390 viewport dimensions: drag/release, second-finger rejection, interrupted/lost capture, keyboard launch, background/rotation pause, and browser-toolbar resize.
- UI startup, shop preview/purchase, pause/restart, finish/unlock/next, crash rewards, wallet restoration, and quality settings. These viewport tests simulate inputs; they do not render CSS layouts.
- Two-post slingshot construction, visible band stretching, release position continuity, and rider alignment on raised banks.

Scene checks construct geometry without rendering GPU frames. UI tests use a renderer stub. This environment does not provide browser/GPU or physical-device playtesting, so visual layout, actual frame rate, and touch feel still require hands-on verification. Economic pacing is an initial balance, not retention-tested.
