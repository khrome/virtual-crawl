virtual-crawl
=============
![virtual-crawl](http://i.imgur.com/uVGdINP.gif)

Virtual crawl is a roguelite boilerplate.

Usage
-----
clone the repo, then pull the mini-dungeon assets from [kenny.nl](https://kenney.nl/assets/mini-dungeon)(eventually we might build our own, but for now you need to go get them). Unzip them, then put them in the assets folder in it's own directory `mini-dungeon`.

Now you can launch the game with: 

```bash
npm run start
```

Stack
-----
This boilerplate assembles a large stack of underlying libraries to make a simple surface to build [roguelites](https://en.wikipedia.org/wiki/Roguelike#Rogue-lites_and_procedural_death_labyrinths) using traditional [roguelike](https://en.wikipedia.org/wiki/Roguelike) techniques.

- [electron](https://www.electronjs.org/) using [commonjs](https://en.wikipedia.org/wiki/CommonJS) on the backend and [browser native ESM](https://www.esmodules.site/) on the frontend so views can be refreshed with a reload. 
- [submesh-treadmill](https://www.npmjs.com/package/submesh-treadmill) to render the gameworld, handle markers, and physics (with [cannon.js](https://www.npmjs.com/package/cannon)) using [three.js](https://www.npmjs.com/package/three) 
- [procedural-layouts](https://www.npmjs.com/package/procedural-layouts) to generate purely ascii/ansi dungeon definitions which are delivered to the client for 
- [skeleton-keyhole](https://www.npmjs.com/package/skeleton-keyhole) to render the ascii tiles as maptiles for the minimap
- we serve maptiles using [tilestrata](https://www.npmjs.com/package/tilestrata) a traditional map tile server compatible with many [slippy map](https://wiki.openstreetmap.org/wiki/Slippy_map) libraries
- We use [FBX](https://code.blender.org/2013/08/fbx-binary-file-format-specification/) models to encapsulate our creatures
- [TODO] Markers use [Sutra.js](https://www.npmjs.com/package/@yantra-core/sutra)

Testing
-------
TBD