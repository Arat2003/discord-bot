export const addCommas = (number: string) => {
  if (number === "null" || number === "undefined") return "0";

  number += "";
  let x = number.split(".");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

export const insertString = (
  string: string,
  index: number,
  value: string
): string => string.substr(0, index) + value + string.substr(index);

export const capitalize = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const styleGamemodes = (gamemode: string) => {
  let res: string[] = gamemode
    .replace(/QUAKECRAFT/, "Quakecraft")
    .replace(/WALLS/, "Walls")
    .replace(/PAINTBALL/, "Paintball")
    .replace(/SURVIVAL_GAMES/, "Blitz Survival Games")
    .replace(/TNTGAMES/, "TNT Games")
    .replace(/VAMPIREZ/, "VampireZ")
    .replace(/Walls3/, "Mega Walls")
    .replace(/ARCADE/, "Arcade")
    .replace(/ARENA/, "Arena")
    .replace(/UHC/, "UHC Champions")
    .replace(/MCGO/, "Cops and Crims")
    .replace(/BATTLEGROUND/, "Warlords")
    .replace(/SUPER_SMASH/, "Smash Heroes")
    .replace(/GINGERBREAD/, "Turbo Kart Racers")
    .replace(/HOUSING/, "Housing")
    .replace(/SKYWARS/, "Skywars")
    .replace(/TRUE_COMBAT/, "Crazy Walls")
    .replace(/SPEED_UHC/, "Speed UHC")
    .replace(/SKYCLASH/, "SkyClash")
    .replace(/LEGACY/, "Classic Games")
    .replace(/PROTOTYPE/, "Prototype")
    .replace(/BEDWARS/, "Bedwars")
    .replace(/MURDER_MYSTERY/, "Murder Mystery")
    .replace(/BUILD_BATTLE/, "Build Battle")
    .replace(/DUELS/, "Duels")
    .replace(/SKYBLOCK/, "Skyblock")
    .replace(/PIT/, "Pit")
    .split(",");

  return res;
};
