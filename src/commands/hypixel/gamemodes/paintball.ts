import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import paintballWrapper from "../../../util/wrappers/gamemodes/paintball";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Paintball extends Command {
  name = "paintball";
  aliases = ["pb", "paintballwarfare", "pw"];
  description = "Player's Paintball stats";
  category: Categories = "Player";
  stats = true;
  usage = "[usage]";

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
    const stats = paintballWrapper(player.stats.Paintball);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Wins", value: `\`${stats.wins}\``, inline: true },
      { name: "Killstreaks", value: `\`${stats.killstreaks}\``, inline: true },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.kdr}\``, inline: true },
      { name: "Shots Fired", value: `\`${stats.shotsFired}\``, inline: true },
      { name: "Forcefield", value: `\`${stats.forcefield}\``, inline: true },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      skinUrl,
      embedFields,
      "Paintball - **Overall**"
    );

    message.channel.stopTyping();
    return message.channel.send(embed);
  }
}

export default Paintball;
