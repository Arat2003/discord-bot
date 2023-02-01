import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { gamemodeEmbedMaker } from "../../../util/functions/embeds";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import blitzWrapper from "../../../util/wrappers/gamemodes/blitz";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Blitz extends Command {
  name = "blitz";
  aliases = ["hg", "hungergames"];
  description = "Player's Blitz Survival Games stats.";
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

    const stats = blitzWrapper(player.stats.HungerGames);

    const embedFields: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      { name: "Games Played", value: `\`${stats.gamesPlayed}\``, inline: true },
      {
        name: "Chests Opened",
        value: `\`${stats.chestsOpened}\``,
        inline: true,
      },
      { name: "Kills", value: `\`${stats.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.kdr}\``, inline: true },
      { name: "Wins Solo", value: `\`${stats.winsSolo}\``, inline: true },
      { name: "Wins Teams", value: `\`${stats.winsTeam}\``, inline: true },
      { name: "WLR", value: `\`${stats.wlr}\``, inline: true },
    ];

    const skinUrl = skinImage(playerUUID, "face");
    const embed = gamemodeEmbedMaker(
      this.client,
      player.parsed,
      embedFields,
      "Blitz Hunger Games - **Overall**"
    );

    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default Blitz;
