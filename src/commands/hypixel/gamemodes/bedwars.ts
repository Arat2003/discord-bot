import { EmbedField, Message, TextChannel } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import bedwarsWrapper, {
  getBedwarsPresColor,
} from "../../../util/wrappers/gamemodes/bedwars";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Bedwars extends Command {
  name = "bedwars";
  aliases = ["bw", "bedwar"];
  description = "Player's Bedwars stats.";
  category: Categories = "Player";
  usage = "[username]";
  stats = true;

  async execute(message: Message, args: string[]) {
    message.channel.startTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;

    if (args.length >= 1) {
      let a = await getUserOrUUID(args[0]);
      playerUUID = a?.uuid;
    } else if (!user && !args.length) {
      return (
        message.channel.send(
          this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
        ) && message.channel.stopTyping()
      );
    } else {
      playerUUID = user?.minecraftUUID;
    }

    if (!playerUUID) {
      return (
        message.channel.send(
          this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
        ) && message.channel.stopTyping()
      );
    }

    const player = await playerWrapper(playerUUID as string);

    if (!player) {
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)
      );
    }

    const bw = bedwarsWrapper(player.stats.Bedwars);
    const level = player.achievements.bedwars_level || 1;
    const color = getBedwarsPresColor(level);

    const overall = createArrays(bw, "overall", level);
    const solos = createArrays(bw, "solos", level);
    const duos = createArrays(bw, "duos", level);
    const threes = createArrays(bw, "threes", level);
    const four_four = createArrays(bw, "four_four", level);
    const two_four = createArrays(bw, "two_four", level);

    let pages = [
      { arr: overall, desc: "Overall" },
      { arr: solos, desc: "Solos" },
      { arr: duos, desc: "Doubles" },
      { arr: threes, desc: "Threes" },
      { arr: four_four, desc: "4v4v4v4" },
      { arr: two_four, desc: "4v4" },
    ];

    const skinUrl = skinImage(playerUUID, "face");

    const embeds = pages.map((page) => {
      const embed = this.client
        .templateEmbed()
        .setColor(color)
        .addFields(page.arr)
        .setTitle(
          `${player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""} ${
            player.parsed.name
          }`
        )
        .setDescription(`Bed Wars - **${page.desc}**`)
        .attachFiles([{ name: "skin.png", attachment: skinUrl }])
        .setThumbnail("attachment://skin.png");

      return embed;
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds);
    pagination.paginate(60000);
    message.channel.stopTyping();
    return;
  }
}

export default Bedwars;

function createArrays(bw: any, type: string, level: number) {
  const arr: EmbedField[] = [
    { name: "☆", value: `\`${level}\``, inline: true },
    { name: "Coins", value: `\`${bw.coins}\``, inline: true },
    {
      name: "Winstreak",
      value: `\`${bw[`${type}`].winstreak}\``,
      inline: true,
    },
    { name: "Kills", value: `\`${bw[`${type}`].kills}\``, inline: true },
    { name: "Deaths", value: `\`${bw[`${type}`].deaths}\``, inline: true },
    { name: "KDR", value: `\`${bw[`${type}`].kdr}\``, inline: true },
    {
      name: "Final Kills",
      value: `\`${bw[`${type}`].finalKills}\``,
      inline: true,
    },
    {
      name: "Final Deaths",
      value: `\`${bw[`${type}`].finalDeaths}\``,
      inline: true,
    },
    { name: "FKDR", value: `\`${bw[`${type}`].fkdr}\``, inline: true },
    { name: "Wins", value: `\`${bw[`${type}`].wins}\``, inline: true },
    { name: "Losses", value: `\`${bw[`${type}`].losses}\``, inline: true },
    { name: "WLR", value: `\`${bw[`${type}`].wlr}\``, inline: true },
    {
      name: "Beds Broken",
      value: `\`${bw[`${type}`].bedsBroken}\``,
      inline: true,
    },
    { name: "Beds Lost", value: `\`${bw[`${type}`].bedsLost}\``, inline: true },
    { name: "BBLR", value: `\`${bw[`${type}`].bblr}\``, inline: true },
    {
      name: "Games Played",
      value: `\`${bw[`${type}`].gamesPlayed}\``,
      inline: true,
    },
    {
      name: "Avg. Finals / Game",
      value: `\`${bw[`${type}`].finals_per_game}\``,
      inline: true,
    },
    {
      name: "Avg. Beds / Game",
      value: `\`${bw[`${type}`].beds_per_game}\``,
      inline: true,
    },
  ];

  return arr;
}

// favourites_2 is shop layout.
