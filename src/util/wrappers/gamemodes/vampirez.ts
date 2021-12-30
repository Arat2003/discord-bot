import { addCommas } from "../../functions/textFunctions";
import { ParsedVampirez } from "../../interfaces/ParsedObjects/gamemodes/ParsedVampirez";

export default function vampirezWrapper(stats: any | null) {
  const parsed: ParsedVampirez = {
    coins: addCommas(`${stats.coins}`),
    humanWins: addCommas(`${stats.human_wins}`),
    humanKills: addCommas(`${stats.human_kills}`),
    humanDeaths: addCommas(`${stats.human_deaths}`),
    humanKdr: (
      (stats.human_kills ? stats.human_kills : 0) /
      (stats.human_deaths ? stats.human_deaths : 1)
    ).toFixed(2),
    vampWins: addCommas(`${stats.vampire_wins}`),
    vampKills: addCommas(`${stats.vampire_kills}`),
    vampDeaths: addCommas(`${stats.vampire_deaths}`),
    vampKdr: (
      (stats.vampire_kills ? stats.vampire_kills : 0) /
      (stats.vampire_deaths ? stats.vampire_deaths : 1)
    ).toFixed(2),
  };

  return parsed;
}
