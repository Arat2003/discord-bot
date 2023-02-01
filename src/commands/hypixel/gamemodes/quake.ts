import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import quakeWrapper from "../../../util/wrappers/gamemodes/quake";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Quake extends Command {
  name = "quake";
  description = "Player's Quake stats";
  category: Categories = "Player";
  stats = true;
  usage = "[username]";

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
    const stats = quakeWrapper(player.stats.Quake);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Wins", value: `\`${stats.wins}\``, inline: true },
      { name: "Headshots", value: `\`${stats.headshots}\``, inline: true },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.kdr}\``, inline: true },
      {
        name: "Highest Killstreak",
        value: `\`${stats.highestKillstreak}\``,
        inline: true,
      },
      { name: "Killstreaks", value: `\`${stats.killstreaks}\``, inline: true },
      {
        name: "Distance Travelled",
        value: `\`${stats.distanceTravelled}\``,
        inline: true,
      },
      { name: "Shots Fired", value: `\`${stats.shotsFired}\``, inline: true },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      embedFields,
      "Quake - **Overall**"
    );

    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default Quake;
