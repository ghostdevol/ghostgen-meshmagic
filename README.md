# GhostGen MeshMagic

Procedural 3D mesh and city generator built for the Ghost World blockchain metaverse.

## What it does

- Parametric generators: buildings, cities, characters, props, weapons, vehicles
- 6 visual styles, 4 city layouts (grid, radial, organic tensor-field, waterfront)
- Real-city import: search by place name or bounding box, pull building/road data from OpenStreetMap (Nominatim + Overpass API), extruded footprints with windowed facades
- Exports scene packs (OBJ/MTL + manifest) for Unity via the `GhostGenSceneImporter` editor script

## Layout

- `app/` — the generator web app (Vite + React + TypeScript + Tailwind + shadcn/ui + react-three-fiber)
- `main.js`, `preload.js`, `package.json` — Electron desktop wrapper

## Run it

Web app:

```sh
cd app
npm install
npm run dev
```

Desktop (Electron):

```sh
npm install
npm start
```

## Notes

- OpenStreetMap data © OpenStreetMap contributors, ODbL.
- Multipolygon relations are skipped by the current importer.
