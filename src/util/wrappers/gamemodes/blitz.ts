import { addCommas } from "../../functions/textFunctions";
import { ParsedBlitz } from "../../interfaces/ParsedObjects/gamemodes/ParsedBlitz";

export default function blitzWrapper(stats: any | null) {
  const kills = stats.kills ? stats.kills : 0;
  const deaths = stats.deaths ? stats.deaths : 1;
  const wins = stats.wins ? stats.wins : 0;
  const losses = stats.games_played ? stats.games_played - wins : 0;

  const parsed: ParsedBlitz = {
    coins: addCommas(`${stats.coins}`),
    chestsOpened: addCommas(`${stats.chests_opened}`),
    gamesPlayed: addCommas(`${stats.games_played}`),
    kills: addCommas(`${stats.kills}`),
    deaths: addCommas(`${stats.deaths}`),
    kdr: (kills / deaths).toFixed(2),
    winsSolo: addCommas(`${stats.wins_solo_normal}`),
    winsTeam: addCommas(`${stats.wins_teams}`),
    wlr: (wins / losses).toFixed(2),
  };

  return parsed;
}
