import { addCommas } from "../../functions/textFunctions";
import { ParsedWalls } from "../../interfaces/ParsedObjects/gamemodes/ParsedWalls";

export default function wallsWrapper(stats: any | null) {
  const kdr =
    (stats.kills ? stats.kills : 0) / (stats.deaths ? stats.deaths : 1);

  const parsed: ParsedWalls = {
    coins: addCommas(`${stats.coins}`),
    rating: (kdr * (stats.wins ? stats.wins : 1)).toFixed(2),
    kills: addCommas(`${stats.kills}`),
    deaths: addCommas(`${stats.deaths}`),
    kdr: kdr.toFixed(2),
    wins: addCommas(`${stats.wins}`),
    losses: addCommas(`${stats.losses}`),
    wlr: (
      (stats.wins ? stats.wins : 0) / (stats.losses ? stats.losses : 1)
    ).toFixed(2),
  };

  return parsed;
}
