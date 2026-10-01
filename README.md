# Damage Control

A 3D ship-sinking and damage-control simulator that runs in the browser (Three.js).

Ships: USS Iowa, Yamato, a Fletcher-class destroyer, the Titanic, Bismarck, HMS Hood and an Essex-class carrier,
each with real watertight compartments, flooding, fire, crew, repair parties, engines and steering.
Historical scenarios, air raids, surface actions, submarines, kamikazes, fleets of up to three ships,
manual gunnery and anti-aircraft guns, a carrier air group you can command or fly yourself
(Hellcats, Helldivers and Avengers), replays and saved games. Weather, night battles, detailed ships,
fire, smoke and explosion effects, and a full soundscape (spoken damage reports are optional and off by default).

Every gun trains and elevates: the main battery lifts to the range it is firing at, and each shot throws out a
muzzle blast that flattens and sprays the sea. Anti-aircraft mounts track and lead incoming aircraft on their own,
with crews at the light guns. The sea has wind ripples, whitecaps in heavy weather, bow waves and wakes, and a
ship going down leaves a boiling whirl of foam and wreckage floating back up.

Splash sounds, all CC0 (public domain) on Freesound: "Big Splash" by Bird_man, "Water splash" by speedygonzo, "Water Explosion" by Sheyvan, "POOL CANONBALL DIVE 4" by tbsounddesigns, "NổLớnDướiNước2" by SieuAmThanh, "S17-22 Underwater explosions" by craigsmith, "Sailing boat, bow wave (close perspective)" by Pfannkuchn.

## Multiplayer (PvP)

Up to four players, two fleets (Blue and Red), up to 2 vs 2. One player hosts and gets a five-letter room code
or an invite link; the others join with it. Everyone picks their own ships (up to 8 ships in all), then the host
starts the battle. Guns, torpedoes and ramming all count. The last fleet with a ship afloat wins.

The host's browser runs the whole battle and sends everyone else snapshots about six times a second.
Connections are peer-to-peer (WebRTC through PeerJS's free public matchmaking server), so there is no game server.

To test alone on one computer, open the page in two tabs of the same browser with `?net=local` added to the address. The tabs then talk to each other directly instead of through the matchmaking server.

## Run locally

It's a single static page. Open `index.html` in a browser, or serve the folder:

    npx serve .

## Deploy

Deployed on Vercel as a static site. Every push to `main` redeploys.
