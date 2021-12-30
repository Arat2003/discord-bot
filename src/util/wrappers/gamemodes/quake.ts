import { addCommas } from "../../functions/textFunctions";
import { ParsedQuake } from "../../interfaces/ParsedObjects/gamemodes/ParsedQuake";

export default function quakeWrapper(stats: any | null) {
  const wins =
    (stats.wins ? stats.wins : 0) + (stats.wins_teams ? stats.wins_teams : 0);
  const headshots =
    (stats.headshonts ? stats.headshots : 0) +
    (stats.headshots_teams ? stats.headshots_teams : 0);
  const kills =
    (stats.kills ? stats.kills : 0) +
    (stats.kills_teams ? stats.kills_teams : 0);
  const deaths =
    (stats.deaths ? stats.deaths : 0) + stats.deaths_teams
      ? stats.deaths_teams
      : 0;
  const kdr = (kills / (deaths !== 0 ? deaths : 1)).toFixed(2);
  const killstreaks =
    (stats.killstreaks ? stats.killstreaks : 0) +
    (stats.killstreaks_teams ? stats.killstreaks_teams : 0);
  const distanceTravelled =
    (stats.distance_travelled ? stats.distance_travelled : 0) +
    (stats.distance_travelled_teams ? stats.distance_travelled_teams : 0);
  const shotsFired =
    (stats.shots_fired ? stats.shots_fired : 0) +
    (stats.shots_fired_teams ? stats.shots_fired_teams : 0);

  const parsed: ParsedQuake = {
    coins: addCommas(`${stats.coins}`),
    wins: addCommas(`${wins}`),
    headshots: addCommas(`${headshots}`),
    kills: addCommas(`${kills}`),
    deaths: addCommas(`${deaths}`),
    kdr,
    highestKillstreak: addCommas(`${stats.highest_killstreak}`),
    killstreaks: addCommas(`${killstreaks}`),
    distanceTravelled: `${addCommas(`${distanceTravelled}`)}m`,
    shotsFired: addCommas(`${shotsFired}`),
  };

  return parsed;
}
