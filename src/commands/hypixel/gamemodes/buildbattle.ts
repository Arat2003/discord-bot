import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
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

    const embed = this.client
      .templateEmbed()
      .setColor(player.parsed.plusColor)
      .setTitle(
        `${player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""} ${
          player.parsed.name
        }`
      )
      .attachFiles([{ name: "skin.png", attachment: skinUrl }])
      .setThumbnail("attachment://skin.png")
      .addFields(embedFields)
      .setDescription("Build Battle - **Overall**");

    message.channel.stopTyping();
    return message.channel.send(embed);
  }
}

export default BuildBattle;
