import { addCommas } from "../../functions/textFunctions";
import { secsToTime } from "../../functions/timeFunctions";
import { ParsedPaintball } from "../../interfaces/ParsedObjects/gamemodes/ParsedPaintball";

export default function paintballWrapper(stats: any | null) {
  const kills = stats.kills ? stats.kills : 0;
  const deaths = stats.deaths ? stats.deaths : 1;

  const parsed: ParsedPaintball = {
    coins: addCommas(`${stats.coins}`),
    wins: addCommas(`${stats.wins}`),
    killstreaks: addCommas(`${stats.killstreaks}`),
    kills: addCommas(`${kills}`),
    deaths: addCommas(`${stats.deaths}`),
    kdr: (kills / deaths).toFixed(2),
    shotsFired: addCommas(`${stats.shots_fired}`),
    forcefield: secsToTime(stats.forcefieldTime),
  };

  return parsed;
}
