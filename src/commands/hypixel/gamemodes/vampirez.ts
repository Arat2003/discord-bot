import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import vampirezWrapper from "../../../util/wrappers/gamemodes/vampirez";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class VampireZ extends Command {
  name = "vampirez";
  description = "Player's VampireZ stats";
  usage = "[username]";
  stats = true;
  category: Categories = "Player";

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
    const stats = vampirezWrapper(player.stats.VampireZ);

    const pages: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Human Wins", value: `\`${stats.humanWins}\``, inline: true },
      { name: "Vampire Wins", value: `\`${stats.vampWins}\``, inline: true },
      { name: "Human Kills", value: `\`${stats.humanKills}\``, inline: true },
      { name: "Human Deaths", value: `\`${stats.humanDeaths}\``, inline: true },
      { name: "Human KDR", value: `\`${stats.humanKdr}\``, inline: true },
      { name: "Vampire Kills", value: `\`${stats.vampKills}\``, inline: true },
      {
        name: "Vampire Deaths",
        value: `\`${stats.vampDeaths}\``,
        inline: true,
      },
      { name: "Vampire KDR", value: `\`${stats.vampKdr}\``, inline: true },
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

export default VampireZ;
