import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import speeduhcWrapper from "../../../util/wrappers/gamemodes/speeduhc";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class SpeedUHC extends Command {
  name = "speeduhc";
  description = "Player's Speed UHC stats";
  usage = "[username]";
  stats = true;
  category: Categories = "Player";

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
    const stats = speeduhcWrapper(player.stats.SpeedUHC);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Level", value: `\`${stats.level}\``, inline: true },
      { name: "Title", value: `\`${stats.title}\``, inline: true },
      { name: "Wins", value: `\`${stats.wins}\``, inline: true },
      { name: "Losses", value: `\`${stats.losses}\``, inline: true },
      { name: "WLR", value: `\`${stats.wlr}\``, inline: true },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.kdr}\``, inline: true },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      embedFields,
      "SpeedUHC - **Overall**"
    );

    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default SpeedUHC;
