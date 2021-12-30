import { EmbedField, Message, TextChannel } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import skyClashWrapper from "../../../util/wrappers/gamemodes/skyclash";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class SkyClash extends Command {
  name = "skyclash";
  aliases = ["sc"];
  description = "Player's Sky Clash stats";
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

    const skinUrl = skinImage(playerUUID, "face");
    const stats = skyClashWrapper(player.stats.SkyClash);

    let pages = [
      { arr: createArrays(stats, "overall"), desc: "Overall" },
      { arr: createArrays(stats, "solo"), desc: "Solo" },
      { arr: createArrays(stats, "doubles"), desc: "Doubles" },
      { arr: createArrays(stats, "teamWar"), desc: "Team War" },
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
        .setDescription(`Sky Clash - **${page.desc}**`)
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

export default SkyClash;

function createArrays(stats: any, type: string) {
  const arr: EmbedField[] = [
    { name: "\uFEFF", value: "\uFEFF", inline: true },
    { name: "Coins", value: `\`${stats.coins}\``, inline: true },
    { name: "\uFEFF", value: "\uFEFF", inline: true },
    { name: "Kills", value: `\`${stats[type].kills}\``, inline: true },
    { name: "Deaths", value: `\`${stats[type].deaths}\``, inline: true },
    { name: "KDR", value: `\`${stats[type].kdr}\``, inline: true },
    { name: "Wins", value: `\`${stats[type].wins}\``, inline: true },
    { name: "Losses", value: `\`${stats[type].losses}\``, inline: true },
    { name: "WLR", value: `\`${stats[type].wlr}\``, inline: true },
  ];

  return arr;
}
