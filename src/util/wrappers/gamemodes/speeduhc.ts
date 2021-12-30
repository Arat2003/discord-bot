import { addCommas } from "../../functions/textFunctions";
import { ParsedSpeedUHC } from "../../interfaces/ParsedObjects/gamemodes/ParsedSpeedUHC";

export default function speeduhcWrapper(stats: any | null) {
  const titleAndLevel = getTitleAndLevel(stats.score);
  const wins = stats.wins ? stats.wins : 0;
  const losses = stats.losses ? stats.losses : 1;
  const kills = stats.kills ? stats.kills : 0;
  const deaths = stats.deaths ? stats.deaths : 1;

  const parsed: ParsedSpeedUHC = {
    coins: addCommas(stats.coins),
    level: titleAndLevel[1] as number,
    title: titleAndLevel[0] as string,
    wins: addCommas(`${wins}`),
    losses: addCommas(`${stats.losses}`),
    wlr: (wins / losses).toFixed(2),
    kills: addCommas(`${kills}`),
    deaths: addCommas(`${stats.deaths}`),
    kdr: (kills / deaths).toFixed(2),
  };

  return parsed;
}

function getTitleAndLevel(score: number) {
  // https://hypixel.net/threads/uhc-update-speed-uhc-balancing-achievements-and-bug-fixes.2084093/
  let title: string = "Hiker";
  let level: number = 1;
  if (score >= 50) {
    title = "Jogger";
    level = 2;
  }
  if (score >= 300) {
    title = "Runner";
    level = 3;
  }
  if (score >= 1050) {
    title = "Sprinter";
    level = 4;
  }
  if (score >= 2550) {
    title = "Turbo";
    level = 5;
  }
  if (score >= 5550) {
    title = "Sanic";
    level = 6;
  }
  if (score >= 15550) {
    title = "Hot Rod";
    level = 7;
  }
  if (score >= 30550) {
    title = "Bolt";
    level = 8;
  }
  if (score >= 55550) {
    title = "Zoom";
    level = 9;
  }
  if (score >= 85550) {
    title = "God Speed";
    level = 10;
  }

  return [title, level];
}
