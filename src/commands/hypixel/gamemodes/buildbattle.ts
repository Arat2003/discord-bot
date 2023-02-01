import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import buildBattleWrapper from "../../../util/wrappers/gamemodes/buildbattle";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class BuildBattle extends Command {
  name = "buildbattle";
  aliases = ["bb"];
  description = "Player's Build Battle stats";
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

    const stats = buildBattleWrapper(player.stats.BuildBattle);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Score", value: `\`${stats.score}\``, inline: true },
      { name: "Title", value: `\`${stats.title}\``, inline: true },
      { name: "Games Played", value: `\`${stats.gamesPlayed}\``, inline: true },
      { name: "Total Wins", value: `\`${stats.totalWins}\``, inline: true },
      {
        name: "GTB Correct Guesses",
        value: `\`${stats.correctGuesses}\``,
        inline: true,
      },
      { name: "Wins Solo", value: `\`${stats.winsSolo}\``, inline: true },
      {
        name: "Wins Solo Pro",
        value: `\`${stats.winsSoloPro}\``,
        inline: true,
      },
      { name: "Wins Teams", value: `\`${stats.winsTeams}\``, inline: true },
      {
        name: "Wins GTB",
        value: `\`${stats.winsGuessTheBuild}\``,
        inline: true,
      },
      { name: "Total Votes", value: `\`${stats.totalVotes}\``, inline: true },
    ];

    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      embedFields,
      "Build Battle - **Overall**"
    )

    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default BuildBattle;
