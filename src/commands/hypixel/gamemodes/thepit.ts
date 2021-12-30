import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import pitWrapper from "../../../util/wrappers/gamemodes/thepit";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Pit extends Command {
  name = "thepit";
  aliases = ["pit"];
  stats = true;
  description = "Player's The Pit stats";
  usage = "[username]";
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
    const stats = pitWrapper(player.stats.Pit);

    const embedFields: EmbedField[] = [
      { name: "Experience", value: `\`${stats.experience}\``, inline: true },
      { name: "Cash", value: `\`${stats.cash}\``, inline: true },
      { name: "Playtime", value: `\`${stats.playtime}\``, inline: true },
      {
        name: "Gapples Eaten",
        value: `\`${stats.goldenApplesEaten}\``,
        inline: true,
      },
      {
        name: "Jumps into Pit",
        value: `\`${stats.jumpsIntoPit}\``,
        inline: true,
      },
      {
        name: "Ingots Picked Up",
        value: `\`${stats.ingotsPickedUp}\``,
        inline: true,
      },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.kdr}\``, inline: true },
      { name: "Bow Hits", value: `\`${stats.bowHits}\``, inline: true },
      { name: "Bow Shots", value: `\`${stats.bowShots}\``, inline: true },
      { name: "Bow Accuracy", value: `\`${stats.bowAccuracy}\``, inline: true },
      {
        name: "Highest Kill Streak",
        value: `\`${stats.highestKillstreak}\``,
        inline: true,
      },
      { name: "Damage Dealt", value: `\`${stats.damageDealt}\``, inline: true },
      {
        name: "Damage Received",
        value: `\`${stats.damageReceived}\``,
        inline: true,
      },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      skinUrl,
      embedFields,
      "The Pit - **Overall**"
    );

    message.channel.stopTyping();
    return message.channel.send(embed);
  }
}

export default Pit;
