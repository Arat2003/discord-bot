import { addCommas } from "../../functions/textFunctions";
import { SmashTypes } from "../../interfaces/gametypes";
import { ParsedSmash } from "../../interfaces/ParsedObjects/gamemodes/ParsedSmash";
import { KDRWLR } from "../../interfaces/ParsedObjects/KDRWLR";

export default function smashWrapper(stats: any | null) {
  const parsed: ParsedSmash = {
    level: addCommas(`${stats.smashLevel}`),
    coins: addCommas(`${stats.coins}`),
    rageQuits: addCommas(`${stats.quits}`),
    overall: parseTypes(stats, ""),
    one_four: parseTypes(stats, "_normal"),
    two_three: parseTypes(stats, "_teams"),
    two_two: parseTypes(stats, "_2v2"),
  };

  return parsed;
}

function parseTypes(stats: any | null, type: SmashTypes) {
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
