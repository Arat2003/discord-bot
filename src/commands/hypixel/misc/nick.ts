import { Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ParsedPlayer } from "../../../util/interfaces/ParsedObjects/ParsedPlayer";
import { ErrorResponses } from "../../../util/interfaces/responses";
import playerWrapper from "../../../util/wrappers/player";

class Nick extends Command {
  name = "nick";
  aliases = ["changenick"];
  category: Categories = "Misc";
  description =
    "Add a prefix in your nick in this server. (You must link your account to the bot first)\nDoesn't work with users who have got roles above this bot's role in the role hierarchy or server owners.\nPrefixes supported at the moment: Guild Rank (guild), Network Level (network), Rank (rank) and BW (bw or bedwars).";
  usage = "<gamemode/guild rank>";
  cooldown = 60;

  async execute(message: Message, args: string[]): Promise<Message | void> {
    message.channel.sendTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    if (!user) {
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.USER_NOT_VERIFIED)]
      });
    }

    if (!args.length) {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(
            "You have to specify the prefix you want. (Available prefixes: bw, guild, network and rank)"
          )
        ]
      });
    }

    if (args.length > 1) {
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.MORE_THAN_ENOUGH_ARGS)]
      });
    }

    let nick;
    let player = await playerWrapper(user.minecraftUUID);
    let parsedPlayer: ParsedPlayer = player.parsed;

    if (args[0] === "bedwars" || args[0] === "bw") nick = "";
    if (args[0] === "rank") nick = parsedPlayer.rank;
    if (args[0] === "network") nick = Math.trunc(Number(parsedPlayer.level));

    if (nick) {
      message.member
        ?.setNickname(
          `[${nick}] ${message.member.displayName.replace(/\[.*\]./, "")}`
        )
        .then((n) => {
          message.channel.send({
            embeds: [
              this.client
                .templateEmbed()
                .setDescription(
                  `Your nickname has been successfully changed to ${n.nickname}!`
                )
            ]
          });
        })
        .catch(() => {
          message.channel.send({
            embeds: [
              this.client.errorEmbed(
                `**I need more permissions to change your nickname!** Also, make sure that my role (should be \`${
                  message.client.user!.username
                }\`) is **above your roles in the role hierarchy!** And that you're not the server's owner, since unfortunately it won't work with you.`
              )
            ]
          });
        });
    } else {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(
            "You must specify a valid and supported gamemode to change your nickname. (Guild Rank (guild), Network Level (network), Rank (rank) and BW (bw or bedwars))"
          )
        ]
      });
    }
  }
}

export default Nick;
