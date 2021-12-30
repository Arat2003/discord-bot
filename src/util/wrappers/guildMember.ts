import moment from "moment";
import { addCommas } from "../functions/textFunctions";
import { Member } from "../interfaces/ParsedObjects/ParsedGuild";
import { ParsedMember } from "../interfaces/ParsedObjects/ParsedMember";

export default function guildMemberWrapper(
  member: Member,
  guildMembers: Member[],
  uuid: string
) {
  let day1: XpMember[] = [],
    day2: XpMember[] = [],
    day3: XpMember[] = [],
    day4: XpMember[] = [],
    day5: XpMember[] = [],
    day6: XpMember[] = [],
    day7: XpMember[] = [],
    weeklyXP: XpMember[] = [];

  for (const member of guildMembers) {
    weeklyXP.push([
      member.uuid,
      Object.values(member.expHistory).reduce((a, b) => a + b),
    ]);
    day1.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[0]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[0]]
        : 0,
    ]);
    day2.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[1]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[1]]
        : 0,
    ]);
    day3.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[2]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[2]]
        : 0,
    ]);
    day4.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[3]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[3]]
        : 0,
    ]);
    day5.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[4]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[4]]
        : 0,
    ]);
    day6.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[5]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[5]]
        : 0,
    ]);
    day7.push([
      member.uuid,
      typeof member.expHistory[Object.keys(member.expHistory)[6]] == "number"
        ? member.expHistory[Object.keys(member.expHistory)[6]]
        : 0,
    ]);
  }

  let day1Rank,
    day1XP,
    day2Rank,
    day2XP,
    day3Rank,
    day3XP,
    day4Rank,
    day4XP,
    day5Rank,
    day5XP,
    day6Rank,
    day6XP,
    day7Rank,
    day7XP;

  day1
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day1Rank = ++i;
        day1XP = m[1];
      }
    });

  day2
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day2Rank = ++i;
        day2XP = m[1];
      }
    });

  day3
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day3Rank = ++i;
        day3XP = m[1];
      }
    });

  day4
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day4Rank = ++i;
        day4XP = m[1];
      }
    });

  day5
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day5Rank = ++i;
        day5XP = m[1];
      }
    });

  day6
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day6Rank = ++i;
        day6XP = m[1];
      }
    });

  day7
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        day7Rank = ++i;
        day7XP = m[1];
      }
    });

  let weeklyRank;
  let playerWeeklyXP;

  weeklyXP
    .sort((a, b) => b[1] - a[1])
    .filter((m, i) => {
      if (m[0] === uuid) {
        (playerWeeklyXP = m[1]), (weeklyRank = ++i);
      }
    });

  const parsed: ParsedMember = {
    day1Rank: (day1Rank as unknown) as number,
    day2Rank: (day2Rank as unknown) as number,
    day3Rank: (day3Rank as unknown) as number,
    day4Rank: (day4Rank as unknown) as number,
    day5Rank: (day5Rank as unknown) as number,
    day6Rank: (day6Rank as unknown) as number,
    day7Rank: (day7Rank as unknown) as number,
    weeklyRank: (weeklyRank as unknown) as number,

    day1XP: addCommas(`${day1XP}`),
    day2XP: addCommas(`${day2XP}`),
    day3XP: addCommas(`${day3XP}`),
    day4XP: addCommas(`${day4XP}`),
    day5XP: addCommas(`${day5XP}`),
    day6XP: addCommas(`${day6XP}`),
    day7XP: addCommas(`${day7XP}`),
    weeklyXP: addCommas(`${playerWeeklyXP}`),

    rank: member.rank,
    joined: moment(member.joined).format("MM/DD/YYYY"),
  };

  return parsed;
}

type XpMember = [string, number];
