import { addCommas } from "../../functions/textFunctions";
import { BedwarsTypes } from "../../interfaces/gametypes";
import {
  ParsedBedwars,
  BWStats,
} from "../../interfaces/ParsedObjects/gamemodes/ParsedBedwars";

export default function bedwarsWrapper(stats: any | null) {
  let parsed: ParsedBedwars = {
    coins: addCommas(stats.coins),
    overall: parseType(stats, ""),
    solos: parseType(stats, "eight_one_"),
    duos: parseType(stats, "eight_two_"),
    threes: parseType(stats, "four_three_"),
    four_four: parseType(stats, "four_four_"),
    two_four: parseType(stats, "two_four_"),
  };

  return parsed;
}

function parseType(stats: any | null, type: BedwarsTypes) {
  let obj: BWStats = {
    winstreak: addCommas(`${stats[`${type}winstreak`]}`),
    kills: addCommas(`${stats[`${type}kills_bedwars`]}`),
    deaths: addCommas(`${stats[`${type}deaths_bedwars`]}`),
    kdr: (
      (stats[`${type}kills_bedwars`] ? stats[`${type}kills_bedwars`] : 0) /
      (stats[`${type}deaths_bedwars`] ? stats[`${type}deaths_bedwars`] : 1)
    ).toFixed(2),
    finalKills: addCommas(`${stats[`${type}final_kills_bedwars`]}`),
    finalDeaths: addCommas(`${stats[`${type}final_deaths_bedwars`]}`),
    fkdr: (
      (stats[`${type}final_kills_bedwars`]
        ? stats[`${type}final_kills_bedwars`]
        : 0) /
      (stats[`${type}final_deaths_bedwars`]
        ? stats[`${type}final_deaths_bedwars`]
        : 1)
    ).toFixed(2),
    wins: addCommas(`${stats[`${type}wins_bedwars`]}`),
    losses: addCommas(`${stats[`${type}losses_bedwars`]}`),
    wlr: (
      (stats[`${type}wins_bedwars`] ? stats[`${type}wins_bedwars`] : 0) /
      (stats[`${type}losses_bedwars`] ? stats[`${type}losses_bedwars`] : 1)
    ).toFixed(2),
    bedsBroken: addCommas(`${stats[`${type}beds_broken_bedwars`]}`),
    bedsLost: addCommas(`${stats[`${type}beds_lost_bedwars`]}`),
    bblr: (
      (stats[`${type}beds_broken_bedwars`]
        ? stats[`${type}beds_broken_bedwars`]
        : 0) /
      (stats[`${type}beds_lost_bedwars`]
        ? stats[`${type}beds_lost_bedwars`]
        : 1)
    ).toFixed(2),
    finals_per_game: (
      (stats[`${type}final_kills_bedwars`]
        ? stats[`${type}final_kills_bedwars`]
        : 0) /
      (stats[`${type}games_played_bedwars`]
        ? stats[`${type}games_played_bedwars`]
        : 1)
    ).toFixed(2),
    beds_per_game: (
      (stats[`${type}beds_broken_bedwars`]
        ? stats[`${type}beds_broken_bedwars`]
        : 0) /
      (stats[`${type}games_played_bedwars`]
        ? stats[`${type}games_played_bedwars`]
        : 1)
    ).toFixed(2),
    gamesPlayed: addCommas(`${stats[`${type}games_played_bedwars`]}`),
  };

  return obj;
}

export function getBedwarsPresColor(star: number) {
  let prestigeColor = `#AAAAAA`;
  if (star >= 0) {
    prestigeColor = "#AAAAAA";
  }
  if (star >= 100) {
    prestigeColor = "#F2F2F2";
  }
  if (star >= 200) {
    prestigeColor = "#FFAA00";
  }
  if (star >= 300) {
    prestigeColor = "#55FFFF";
  }
  if (star >= 400) {
    prestigeColor = "#00AA00";
  }
  if (star >= 500) {
    prestigeColor = "#00AAAA";
  }
  if (star >= 600) {
    prestigeColor = "#AA0000";
  }
  if (star >= 700) {
    prestigeColor = "#FF55FF";
  }
  if (star >= 800) {
    prestigeColor = "#5555FF";
  }
  if (star >= 900) {
    prestigeColor = "#AA00AA";
  }
  if (star >= 1000) {
    let letters = "0123456789ABCDEF";
    prestigeColor = "#";
    for (var i = 0; i < 6; i++) {
      prestigeColor += letters[Math.floor(Math.random() * 16)];
    }
  }

  return prestigeColor;
}
