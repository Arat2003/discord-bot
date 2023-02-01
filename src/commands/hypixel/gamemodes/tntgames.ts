import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import tntGamesWrapper from "../../../util/wrappers/gamemodes/tntgames";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class TntGames extends Command {
  name = "tntgames";
  aliases = ["tnt"];
  description = "Player's TNT Games stats";
  stats = true;
  usage = "[username]";
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
    const stats = tntGamesWrapper(player.stats.TNTGames);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "TNT Run Wins", value: `\`${stats.tntRunWins}\``, inline: true },
      {
        name: "TNT Run Record (H:M:S)",
        value: `\`${stats.tntRunRecord}\``,
        inline: true,
      },
      { name: "TNTag Wins", value: `\`${stats.tntTagWins}\``, inline: true },
      {
        name: "Bowspleef Wins",
        value: `\`${stats.bowspleefWins}\``,
        inline: true,
      },
      {
        name: "Bowspleef Losses",
        value: `\`${stats.bowspleefLosses}\``,
        inline: true,
      },
      {
        name: "Wizards Kills",
        value: `\`${stats.wizardsKills}\``,
        inline: true,
      },
      {
        name: "Wizards Deaths",
        value: `\`${stats.wizardsDeaths}\``,
        inline: true,
      },
      { name: "Wizards Wins", value: `\`${stats.wizardsWins}\``, inline: true },
      {
        name: "PvP Run Kills",
        value: `\`${stats.pvpRunKills}\``,
        inline: true,
      },
      {
        name: "PvP Run Deaths",
        value: `\`${stats.pvpRunDeaths}\``,
        inline: true,
      },
      { name: "PvP Run Wins", value: `\`${stats.pvpRunWins}\``, inline: true },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      embedFields,
      "TNT Games - **Overall**"
    );

    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default TntGames;
