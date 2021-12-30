import { addCommas, capitalize } from "../../functions/textFunctions";
import { SkyWarsTypes } from "../../interfaces/gametypes";
import {
  ParsedSkywars,
  SWStatsInsane,
} from "../../interfaces/ParsedObjects/gamemodes/ParsedSkywars";
import { KDRWLR } from "../../interfaces/ParsedObjects/KDRWLR";

export default function skyWarsWrapper(stats: any | null) {
  const parsed: ParsedSkywars = {
    // winstreak: addCommas(`${stats[`win_streak`]}`),
    coins: addCommas(`${stats.coins}`),
    souls: addCommas(`${stats.souls}`),
    level: addCommas(`${getSWLevel(stats.skywars_experience)}`),
    overall: parseTypes(stats, ""),
    solos: parseTypeWithInsane(stats, "_solo_normal", "_solo_insane"),
    teams: parseTypeWithInsane(stats, "_team_normal", "_team_insane"),
    ranked: parseTypes(stats, "_ranked"),
  };

  return parsed;
}

function parseTypes(stats: any | null, type: SkyWarsTypes) {
  const obj: KDRWLR = {
    kills: addCommas(`${stats[`kills${type}`]}`),
    deaths: addCommas(`${stats[`deaths${type}`]}`),
    kdr: (
      (stats[`kills${type}`] ? stats[`kills${type}`] : 0) /
      (stats[`deaths${type}`] ? stats[`deaths${type}`] : 1)
    ).toFixed(2),
    wins: addCommas(`${stats[`wins${type}`]}`),
    losses: addCommas(`${stats[`losses${type}`]}`),
    wlr: (
      (stats[`wins${type}`] ? stats[`wins${type}`] : 0) /
      (stats[`losses${type}`] ? stats[`losses${type}`] : 1)
    ).toFixed(2),
  };

  return obj;
}

function parseTypeWithInsane(
  stats: any | null,
  type: SkyWarsTypes,
  insaneType: SkyWarsTypes
): SWStatsInsane {
  let normal: any = parseTypes(stats, type);
  for (const key in normal) {
    if (Object.prototype.hasOwnProperty.call(normal, key)) {
      const element = normal[key];
      normal[`normal${capitalize(key)}`] = element;
      delete normal[key];
    }
  }

  let insane: any = parseTypes(stats, insaneType);
  for (const key in insane) {
    if (Object.prototype.hasOwnProperty.call(insane, key)) {
      const element = insane[key];
      insane[`insane${capitalize(key)}`] = element;
      delete insane[key];
    }
  }

  return Object.assign({}, normal, insane);
}

function getSWLevel(xp: number) {
  const xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
  let level = 0;

  if (xp >= 15000) {
    level = (xp - 15000) / 10000 + 12;
  } else {
    for (let i = 0; i < xps.length; i++) {
      if (xp < xps[i]) {
        level = i + (xp - xps[i - 1]) / (xps[i] - xps[i - 1]);
        break;
      }
    }
  }

  return Math.trunc(level);
}
