import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import wallsWrapper from "../../../util/wrappers/gamemodes/walls";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Walls extends Command {
  name = "walls";
  aliases = ["thewalls"];
  description = "Player's The Walls stats";
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
    const stats = wallsWrapper(player.stats.Walls);

    const pages: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Rating", value: `\`${stats.rating}\``, inline: true },
      { name: "\uFEFF", value: "\uFEFF", inline: true },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.kdr}\``, inline: true },
      { name: "Wins", value: `\`${stats.wins}\``, inline: true },
      { name: "Losses", value: `\`${stats.losses}\``, inline: true },
      { name: "WLR", value: `\`${stats.wlr}\``, inline: true },
    ];

    const embed = this.client
      .templateEmbed()
      .setColor(player.parsed.plusColor)
      .addFields(pages)
      .setTitle(
        `${player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""} ${
          player.parsed.name
        }`
      )
      .setDescription(`VampireZ - **Overall**`)
      .attachFiles([{ name: "skin.png", attachment: skinUrl }])
      .setThumbnail("attachment://skin.png");

    message.channel.stopTyping();
    message.channel.send(embed);
    return;
  }
}

export default Walls;
