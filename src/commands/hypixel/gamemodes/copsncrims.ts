import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import MCGOWrapper from "../../../util/wrappers/gamemodes/copsncrims";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class CopsNCrims extends Command {
  name = "copsncrims";
  aliases = ["cc", "cnc"];
  description = "Player's Cops & Crims stats";
  usage = "[username]";
  category: Categories = "Player";
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

    const stats = MCGOWrapper(player.stats.MCGO);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Game Wins", value: `\`${stats.gameWins}\``, inline: true },
      { name: "Round Wins", value: `\`${stats.roundWins}\``, inline: true },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "Headshots", value: `\`${stats.headshots}\``, inline: true },
      { name: "Cop Kills", value: `\`${stats.copKills}\``, inline: true },
      {
        name: "Criminal Kills",
        value: `\`${stats.criminalKills}\``,
        inline: true,
      },
      {
        name: "Deathmatch Kills",
        value: `\`${stats.deathmatchKills}\``,
        inline: true,
      },
      { name: "Shots Fired", value: `\`${stats.shotsFired}\``, inline: true },
      {
        name: "Bombs Planted",
        value: `\`${stats.bombsPlanted}\``,
        inline: true,
      },
      {
        name: "Bombs Defused",
        value: `\`${stats.bombsDefused}\``,
        inline: true,
      },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      embedFields,
      "Cops & Crims - **Overall**"
    );

    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default CopsNCrims;
