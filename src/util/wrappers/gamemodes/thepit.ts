import { addCommas } from "../../functions/textFunctions";
import { ParsedPit } from "../../interfaces/ParsedObjects/gamemodes/ParsedPit";

export default function pitWrapper(stats: any) {
  const kills = stats.pit_stats_ptl.kills ? stats.pit_stats_ptl.kills : 0;
  const deaths = stats.pit_stats_ptl.deaths ? stats.pit_stats_ptl.deaths : 1;
  const bowShots = stats.pit_stats_ptl.arrows_fired
    ? stats.pit_stats_ptl.arrows_fired
    : 0;
  const bowHits = stats.pit_stats_ptl.arrow_hits
    ? stats.pit_stats_ptl.arrow_hits
    : 1;

  const parsed: ParsedPit = {
    experience: addCommas(`${stats.profile.xp}`),
    cash: addCommas(stats.profile.cash.toFixed(2)),
    playtime: `${addCommas(`${stats.pit_stats_ptl.playtime_minutes}`)}m`,
    goldenApplesEaten: addCommas(`${stats.pit_stats_ptl.gapple_eaten}`),
    jumpsIntoPit: addCommas(`${stats.pit_stats_ptl.jumped_into_pit}`),
    ingotsPickedUp: addCommas(`${stats.pit_stats_ptl.ingots_picked_up}`),
    kills: addCommas(`${kills}`),
    deaths: addCommas(`${stats.pit_stats_ptl.deaths}`),
    kdr: (kills / deaths).toFixed(2),
    bowHits: addCommas(`${stats.pit_stats_ptl.arrow_hits}`),
    bowShots: addCommas(`${bowShots}`),
    bowAccuracy: `${((bowShots / bowHits) * 100).toFixed(2)}%`,
    highestKillstreak: addCommas(`${stats.pit_stats_ptl.max_streak}`),
    damageDealt: addCommas(`${stats.pit_stats_ptl.damage_dealt}`),
    damageReceived: addCommas(`${stats.pit_stats_ptl.damage_received}`),
  };

  return parsed;
}
