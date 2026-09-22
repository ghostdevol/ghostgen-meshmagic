import { mulberry32 } from './prng';

export interface CityBuilding {
  name: string;
  gx: number; // grid coords
  gz: number;
  x: number; // world position (building center)
  z: number;
  w: number; // size
  h: number;
  d: number;
  color: string;
  dAppType: string | null; // 'wallet' | 'bank' | 'casino' | 'museum' | null
  walletGated: boolean;
  faction: string;
}

export interface CityRoad {
  x: number;
  z: number;
  w: number;
  d: number;
}

export interface CityLayout {
  cityName: string;
  gridSize: number;
  spacing: number;
  seed: number;
  buildings: CityBuilding[];
  roads: CityRoad[];
}

interface DAppSpot {
  gx: number;
  gz: number;
  dAppType: string;
  name: string;
  color: string;
  walletGated: boolean;
}

// The Ghost World buildings: fixed plots so the world always has its
// wallet hub, bank (portfolio), casino (slots) and museum (NFTs).
function dAppSpots(gridSize: number): DAppSpot[] {
  const c = Math.floor(gridSize / 2);
  const spots: DAppSpot[] = [
    { gx: c, gz: c, dAppType: 'wallet', name: 'Wallet_Hub', color: 'hsl(180, 100%, 50%)', walletGated: true },
    { gx: 0, gz: 0, dAppType: 'bank', name: 'Bank', color: 'hsl(45, 100%, 50%)', walletGated: true },
    { gx: gridSize - 1, gz: 0, dAppType: 'casino', name: 'Casino', color: 'hsl(300, 100%, 55%)', walletGated: false },
    { gx: 0, gz: gridSize - 1, dAppType: 'museum', name: 'Museum', color: 'hsl(270, 90%, 60%)', walletGated: false },
  ];
  // On tiny grids some spots would share a cell — keep the first claim.
  const seen = new Set<string>();
  return spots.filter((s) => {
    const k = `${s.gx},${s.gz}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const cache = new Map<string, CityLayout>();

export function getCityLayout(parameters: Record<string, number>): CityLayout {
  const gridSize = Math.max(3, Math.round(parameters.gridSize || 5));
  const spacing = parameters.spacing || 2;
  const maxHeight = parameters.maxHeight || 8;
  const minHeight = parameters.minHeight || 2;
  const seed = Math.max(1, Math.round(parameters.seed || 7));

  const key = `${gridSize}|${spacing}|${minHeight}|${maxHeight}|${seed}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rand = mulberry32(seed);
  const spots = dAppSpots(gridSize);
  const spotByCell = new Map(spots.map((s) => [`${s.gx},${s.gz}`, s]));

  const buildings: CityBuilding[] = [];
  for (let gx = 0; gx < gridSize; gx++) {
    for (let gz = 0; gz < gridSize; gz++) {
      const spot = spotByCell.get(`${gx},${gz}`);
      const h = spot ? maxHeight * 1.5 : minHeight + rand() * (maxHeight - minHeight);
      const w = 0.8 + rand() * 0.4;
      const d = 0.8 + rand() * 0.4;
      buildings.push({
        name: spot ? spot.name : `Tower_${gx}_${gz}`,
        gx,
        gz,
        x: (gx - gridSize / 2) * spacing,
        z: (gz - gridSize / 2) * spacing,
        w,
        h,
        d,
        color: spot ? spot.color : `hsl(216, 30%, ${Math.round(40 + rand() * 30)}%)`,
        dAppType: spot ? spot.dAppType : null,
        walletGated: spot ? spot.walletGated : false,
        faction: 'Ghost',
      });
    }
  }

  const roads: CityRoad[] = [];
  for (let i = 0; i <= gridSize; i++) {
    const p = (i - gridSize / 2) * spacing;
    roads.push({ x: 0, z: p, w: gridSize * spacing, d: 0.3 });
    roads.push({ x: p, z: 0, w: 0.3, d: gridSize * spacing });
  }

  const layout: CityLayout = {
    cityName: 'Ghost World — Sector 01',
    gridSize,
    spacing,
    seed,
    buildings,
    roads,
  };
  cache.set(key, layout);
  return layout;
}

// Shape the JSON the way GhostCityEditor.cs expects
// (x, z, prefab, faction, walletGated, dAppType), plus mesh data.
export function cityLayoutToJson(layout: CityLayout) {
  return {
    cityName: layout.cityName,
    seed: layout.seed,
    gridSize: layout.gridSize,
    spacing: layout.spacing,
    buildings: layout.buildings.map((b) => ({
      x: b.gx,
      z: b.gz,
      prefab: b.name,
      faction: b.faction,
      walletGated: b.walletGated,
      dAppType: b.dAppType,
      mesh: { x: b.x, z: b.z, w: b.w, h: b.h, d: b.d, color: b.color },
    })),
  };
}
