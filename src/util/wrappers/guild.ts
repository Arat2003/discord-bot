import chalk from "chalk";
import moment from "moment";
import fetch from "node-fetch";
import { getLevel, guildScaledExp } from "../functions/guildUtil";
import { styleGamemodes } from "../functions/textFunctions";
import { guildFetchTypes } from "../interfaces/fetchTypes";
import { KeyValuePair } from "../interfaces/KeyValuePair";
import {
  DailyXPType,
  HypixelGuild,
  Rank,
} from "../interfaces/ParsedObjects/ParsedGuild";

export default async function guildWrapper(
  name_or_uuid: string,
  type: guildFetchTypes
) {
  const { guild } = await fetch(
    `https://api.hypixel.net/guild?key=${process.env.API_KEY}&${type}=${name_or_uuid}`
  )
    .then((res) => res.json())
    .catch((e) =>
      console.log(chalk.red.bold("[GUILD WRAPPER]") + chalk.red(`${e}`))
    );

  if (!guild) return null;

  let createdOn = moment(guild.created).format("MM/DD/YYYY");
  let tag = guild.tag ? guild.tag : null;
  let guildMembers = guild.members;
  let memberCount = guildMembers.length;
  let guildMaster;
  let totalExp = guild.exp;
  let exp = getLevel(totalExp);
  let name = guild.name;
  let ranks = guild.ranks;
  let tagColor = guild.tagColor;
  let hexColor = getHexColor(tagColor);
  let preferredGames = guild.preferredGames
    ? styleGamemodes(guild.preferredGames.toString())
    : ["None"];
  let expByGameType = guild.guildExpByGameType;

  for (const member of guildMembers) {
    if (member.rank.toLowerCase().replace(" ", "") === "guildmaster") {
      guildMaster = member.uuid;
    }

    let rank: Rank | null = null;
    if (ranks) {
      rank = ranks.find((rank: any) => rank.name === member.rank);
    }

    if (!rank) {
      rank = {
        name: member.rank,
        members: [],
        priority:
          member.rank.toLowerCase().replace(" ", "") === "guildmaster"
            ? 999999
            : 0,
      };
      ranks.push(rank);
    }

    if (!rank.members) rank.members = [];
    rank.members.push(member);
  }

  let weeklyXP = 0;
  let dailyXPMembers = guildMembers.map((m: any) => m.expHistory);
  let dailyXPAll: KeyValuePair<number> = {};

  dailyXPMembers.forEach((m: any) => {
    for (const key in m) {
      if (Object.prototype.hasOwnProperty.call(m, key)) {
        const element: any = m[key];
        if (dailyXPAll[key] == undefined) {
          dailyXPAll[key] = 0;
        }
        dailyXPAll[key] += element;
        weeklyXP += element;
      }
    }
  });

  let dailyXP: KeyValuePair<DailyXPType> = {};
  let scaledWeekly = 0;

  for (const [day, raw] of Object.entries(dailyXPAll)) {
    if (`${raw}` !== "null") {
      dailyXP[day] = { raw, scaled: Number(guildScaledExp(raw)) };
      scaledWeekly += Number(guildScaledExp(raw));
    }
  }

  let guildObj: HypixelGuild = {
    name,
    guildMaster,
    createdOn,
    tag,
    guildMembers,
    memberCount,
    ranks,
    exp,
    tagColor,
    hexColor,
    preferredGames,
    expByGameType,
    totalExp,
    dailyXP,
    weeklyXP,
    scaledWeekly,
  };

  return guildObj;
}

function getHexColor(tagColor: string) {
  let hexColor;
  if (tagColor == "DARK_AQUA") {
    hexColor = "#00AAAA";
  } else if (tagColor == "DARK_GREEN") {
    hexColor = "#00AA00";
  } else if (tagColor == "YELLOW") {
    hexColor = "#FFFF55";
  } else if (tagColor == "GOLD") {
    hexColor = "#FFAA00";
  } else {
    hexColor = "#BAB6B6";
  }

  return hexColor;
}
