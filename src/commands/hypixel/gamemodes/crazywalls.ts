import { EmbedField, Message, TextChannel } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import crazyWallsWrapper from "../../../util/wrappers/gamemodes/crazywalls";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class CrazyWalls extends Command {
  name = "crazywalls";
  description = "Player's Crazy Walls stats";
  aliases = ["cw"];
  category: Categories = "Player";
  usage = "[username]";
  stats = true;

  async execute(message: Message, args: string[]) {
    message.channel.sendTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;

    if (args.length >= 1) {
      let a = await getUserOrUUID(args[0]);
      playerUUID = a?.uuid;
    } else if (!user && !args.length) {
      return (
        message.channel.send({
          embeds: [
            this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
          ]
        })
      );
    } else {
      playerUUID = user?.minecraftUUID;
    }

    if (!playerUUID) {
      return (
        message.channel.send({
          embeds: [
            this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
          ]
        })
      );
    }

    const player = await playerWrapper(playerUUID as string);

    if (!player) {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)
        ]
      });
    }

    const skinUrl = skinImage(playerUUID, "face");
    const stats = crazyWallsWrapper(player.stats.TrueCombat);

    let pages = [
      { arr: createArrays(stats, "overall"), desc: "Overall" },
      { arr: createArrays(stats, "soloNormal"), desc: "Solo Normal" },
      { arr: createArrays(stats, "soloLucky"), desc: "Solo Lucky" },
      { arr: createArrays(stats, "teamsNormal"), desc: "Teams Normal" },
      { arr: createArrays(stats, "teamsLucky"), desc: "Teams Lucky" },
    ];

    const embeds = pages.map((page) => {
      const embed = this.client
        .templateEmbed()
        .setColor(player.parsed.plusColor)
        .addFields(page.arr)
        .setTitle(
          `${player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""} ${
            player.parsed.name
          }`
        )
        .setDescription(`Crazy Walls - **${page.desc}**`)
        .setThumbnail("attachment://img.png");

      return embed;
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds, skinUrl);
    pagination.paginate(60000);
    return;
  }
}

export default CrazyWalls;

function createArrays(stats: any, type: string) {
  const arr: EmbedField[] = [
    { name: "Kills", value: `\`${stats[type].kills}\``, inline: true },
    { name: "Deaths", value: `\`${stats[type].deaths}\``, inline: true },
    { name: "KDR", value: `\`${stats[type].kdr}\``, inline: true },
    { name: "Wins", value: `\`${stats[type].wins}\``, inline: true },
    { name: "Losses", value: `\`${stats[type].losses}\``, inline: true },
    { name: "WLR", value: `\`${stats[type].wlr}\``, inline: true },
  ];

  return arr;
}
