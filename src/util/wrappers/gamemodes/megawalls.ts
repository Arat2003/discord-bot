import { addCommas } from "../../functions/textFunctions";
import { ParsedMegaWalls } from "../../interfaces/ParsedObjects/gamemodes/ParsedMegaWalls";

export default function megawallsWrapper(stats: any | null) {
  const wins = stats.wins ? stats.wins : 0;
  const losses = stats.losses ? stats.losses : 1;
  const kills = stats.kills ? stats.kills : 0;
  const deaths = stats.deaths ? stats.deaths : 1;

  const parsed: ParsedMegaWalls = {
    class: stats.chosen_class,
    coins: addCommas(`${stats.coins}`),
    witherDamage: addCommas(`${stats.wither_damage}`),
    wins: addCommas(`${wins}`),
    losses: addCommas(`${stats.losses}`),
    wlr: (wins / losses).toFixed(2),
    kills: addCommas(`${kills}`),
    deaths: addCommas(`${stats.deaths}`),
    kdr: (kills / deaths).toFixed(2),
    assists: addCommas(`${stats.assists}`),
  };

  return parsed;
}
