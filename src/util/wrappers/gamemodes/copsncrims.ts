import { addCommas } from "../../functions/textFunctions";
import { ParsedCopsNCrims } from "../../interfaces/ParsedObjects/gamemodes/ParsedCopsNCrims";

export default function MCGOWrapper(stats: any | null) {
  const parsed: ParsedCopsNCrims = {
    coins: addCommas(`${stats.coins}`),
    gameWins: addCommas(`${stats.game_wins}`),
    roundWins: addCommas(`${stats.round_wins}`),

    kills: addCommas(`${stats.kills}`),
    deaths: addCommas(`${stats.deaths}`),
    headshots: addCommas(`${stats.headshot_kills}`),

    copKills: addCommas(`${stats.cop_kills}`),
    criminalKills: addCommas(`${stats.criminal_kills}`),
    deathmatchKills: addCommas(`${stats.kills_deathmatch}`),

    shotsFired: addCommas(`${stats.shots_fired}`),
    bombsPlanted: addCommas(`${stats.bombs_planted}`),
    bombsDefused: addCommas(`${stats.bombs_defused}`),
  };

  return parsed;
}
