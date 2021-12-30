import { addCommas } from "../../functions/textFunctions";
import { secsToTime } from "../../functions/timeFunctions";
import { ParsedTntGames } from "../../interfaces/ParsedObjects/gamemodes/ParsedTntGames";

export default function tntGamesWrapper(stats: any) {
  const parsed: ParsedTntGames = {
    coins: addCommas(`${stats.coins}`),
    tntRunWins: addCommas(`${stats.wins_tntrun}`),
    tntRunRecord: secsToTime(`${stats.record_tntrun}`),
    tntTagWins: addCommas(`${stats.wins_tntag}`),
    bowspleefWins: addCommas(`${stats.wins_bowspleef}`),
    bowspleefLosses: addCommas(`${stats.deaths_bowspleef}`),
    wizardsKills: addCommas(`${stats.tntgames_tnt_wizards_kills}`),
    wizardsDeaths: addCommas(`${stats.deaths_capture}`),
    wizardsWins: addCommas(`${stats.tntgames_wizards_wins}`),
    pvpRunKills: addCommas(`${stats.kills_pvprun}`),
    pvpRunDeaths: addCommas(`${stats.deaths_pvprun}`),
    pvpRunWins: addCommas(`${stats.wins_pvprun}`),
  };

  return parsed;
}
