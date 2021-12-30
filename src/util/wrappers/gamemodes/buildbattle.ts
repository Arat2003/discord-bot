import { addCommas } from "../../functions/textFunctions";
import { ParsedBuildBattle } from "../../interfaces/ParsedObjects/gamemodes/ParsedBuildBattle";

export default function buildBattleWrapper(stats: any | null) {
  const score = stats.score;
  let title = "Rookie";
  getTitle(score, title);

  const parsed: ParsedBuildBattle = {
    coins: addCommas(`${stats.coins}`),
    title,
    score: addCommas(`${score}`),
    gamesPlayed: addCommas(`${stats.games_played}`),
    totalWins: addCommas(`${stats.wins}`),
    winsSolo: addCommas(`${stats.wins_solo_normal}`),
    winsSoloPro: addCommas(`${stats.wins_solo_pro}`),
    winsTeams: addCommas(`${stats.wins_teams_normal}`),
    winsGuessTheBuild: addCommas(`${stats.wins_guess_the_build}`),
    correctGuesses: addCommas(`${stats.correct_guesses}`),
    totalVotes: addCommas(`${stats.total_votes}`),
  };

  return parsed;
}

function getTitle(score: number, title: string) {
  if (Number(score) >= 0) {
    title = "Rookie";
  }
  if (Number(score) >= 100) {
    title = "Untrained";
  }
  if (Number(score) >= 250) {
    title = "Amateur";
  }
  if (Number(score) >= 500) {
    title = "Apprentice";
  }
  if (Number(score) >= 1000) {
    title = "Experienced";
  }
  if (Number(score) >= 2000) {
    title = "Seasoned";
  }
  if (Number(score) >= 3500) {
    title = "Trained";
  }
  if (Number(score) >= 5000) {
    title = "Skilled";
  }
  if (Number(score) >= 7500) {
    title = "Talented";
  }
  if (Number(score) >= 10000) {
    title = "Professional";
  }
  if (Number(score) >= 15000) {
    title = "Expert";
  }
  if (Number(score) >= 20000) {
    title = "Master";
  }

  return title;
}
