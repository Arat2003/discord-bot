import { Util } from "discord.js";
import moment from "moment";
import fetch from "node-fetch";
import { addCommas } from "../functions/textFunctions";

export default async function playerWrapper(uuid: string) {
  const { player } = await fetch(
    `https://api.hypixel.net/player?key=${process.env.API_KEY}&uuid=${uuid}`
  ).then((res) => res.json());

  if (!player) return null;

  const player1Rank = player.newPackageRank ? player.newPackageRank : "Non";
  const player2Rank =
    player.monthlyPackageRank == "SUPERSTAR" ? `${player1Rank}+` : player1Rank;

  const player3Rank = player.rank ? player.rank : player2Rank;
  const playerRank = (player.prefix ? player.prefix : player3Rank)
    .replace(/_PLUS/g, "+")
    .replace(/§./g, "")
    .replace(/[\[\]]/g, "");

  const playerLevel = (player.networkExp
    ? Math.sqrt(2 * player.networkExp + 30625) / 50 - 2.5
    : 1
  ).toFixed(2);

  const playerKarma = player.karma ? addCommas(`${player.karma}`) : 0;

  const challengesCompleted = player.challenges
    ? player.challenges.all_time
      ? Object.values(player.challenges.all_time as number[]).reduce(
          (x, y) => x + y
        )
      : 0
    : 0;

  const achievementPoints = player.achievementPoints
    ? addCommas(`${player.achievementPoints}`)
    : 0;

  const questsCompleted = addCommas(`${parseQuests(player.quests)}`);

  const firstLogin = moment(player.firstLogin).format("MM/DD/YYYY");
  const lastLogin = moment(player.lastLogin).format("MM/DD/YYYY");

  const status = isOnline(player.lastLogin, player.lastLogout);
  const plusColor = getPlusColor(player.rankPlusColor, playerRank);

  const parsedObj = {
    parsed: {
      name: Util.escapeMarkdown(player.displayname),
      rank: playerRank,
      level: playerLevel,
      karma: playerKarma,
      achievementPoints,
      questsCompleted,
      challengesCompleted: addCommas(`${challengesCompleted}`),
      firstLogin,
      lastLogin,
      status,
      plusColor,
    },
  };

  Object.assign(player, parsedObj);

  return player;
}

const isOnline = (lastLogin: number, lastLogout: number) =>
  lastLogin > lastLogout ? "Online" : "Offline";

function parseQuests(quests: any) {
  let questsCompleted = 0;
  if (!quests) return questsCompleted;

  for (const quest in quests) {
    if (Object.prototype.hasOwnProperty.call(quests[quest], "completions")) {
      quests[quest].completions.forEach((_completion: any) => {
        questsCompleted++;
      });
    }
  }

  return questsCompleted;
}

function getPlusColor(plus: string | undefined, rank: string) {
  var plusCol = `#BAB6B6`;
  if (plus === undefined) {
    plusCol = `#BAB6B6`;
  } else if (plus === "GOLD" || rank === "VIP+") {
    plusCol = `#FFAA00`;
  } else if (plus === "RED") {
    plusCol = `#FF5555`;
  } else if (plus === "GREEN") {
    plusCol = `#55FF55`;
  } else if (plus === "YELLOW") {
    plusCol = `#FFFF55`;
  } else if (plus === "LIGHT_PURPLE") {
    plusCol = `#FF55FF`;
  } else if (plus === "WHITE") {
    plusCol = `#f2f2f2`;
  } else if (plus === "BLUE") {
    plusCol = `#5555FF`;
  } else if (plus === "DARK_GREEN") {
    plusCol = `#00AA00`;
  } else if (plus === "DARK_RED") {
    plusCol = `#AA0000`;
  } else if (plus === "DARK_AQUA") {
    plusCol = `#00AAAA`;
  } else if (plus === "DARK_PURPLE") {
    plusCol = `#AA00AA`;
  } else if (plus === "DARK_GRAY") {
    plusCol = `#555555`;
  } else if (plus === "BLACK") {
    plusCol = `#000`;
  } else if (rank === "PIG+++") {
    plusCol = `#55FFFF`;
  } else {
    plusCol = `#BAB6B6`;
  }
  return plusCol;
}
