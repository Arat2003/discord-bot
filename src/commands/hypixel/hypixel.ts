import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import UserModel from "../../util/database/User";
import { getUserOrUUID } from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../util/interfaces/responses";
import { ParsedPlayer } from "../../util/interfaces/ParsedObjects/ParsedPlayer";
import friendsWrapper from "../../util/wrappers/friends";
import guildWrapper from "../../util/wrappers/guild";
import playerWrapper from "../../util/wrappers/player";
import skinImage from "../../util/wrappers/skinImage";
import { addCommas } from "../../util/functions/textFunctions";

class Hypixel extends Command {
  name = "hypixel";
  category: Categories = "Hypixel";
  aliases = ["h", "network", "n"];
  description = "Player's network stats.";
  usage = "[username]";

  async execute(message: Message, args: string[], _prefix: string) {
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
    const friends = await friendsWrapper(playerUUID as string);
    const guild = await guildWrapper(playerUUID as string, "player");

    if (!player) {
      return (
        message.channel.send(
          this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)
        ) && message.channel.stopTyping()
      );
    }

    const stats: ParsedPlayer = player.parsed;

    const statusEmoji =
      stats.status === "Online"
        ? this.client.getEmoji("online", "begger")
        : this.client.getEmoji("offline", "begger");

    const fields = [
      {
        name: "Rank",
        value: `\`${stats.rank}\``,
        inline: true,
      },
      {
        name: "Level",
        value: `\`${stats.level}\``,
        inline: true,
      },
      {
        name: "Guild",
        value: `\`${guild ? guild.name : "None"}\``,
        inline: true,
      },
      {
        name: "Karma",
        value: `\`${stats.karma}\``,
        inline: true,
      },
      {
        name: "Current Status",
        value: `<:${statusEmoji?.name}:${statusEmoji?.id}> \`${stats.status}\``,
        inline: true,
      },
      {
        name: "Friends",
        value: friends ? `\`${addCommas(`${friends.length}`)}\`` : `\`0\``,
        inline: true,
      },
      {
        name: "Achievement Points",
        value: `\`${stats.achievementPoints}\``,
        inline: true,
      },
      {
        name: "Challenges Finished",
        value: `\`${stats.challengesCompleted}\``,
        inline: true,
      },
      {
        name: "Quests Finished",
        value: `\`${stats.questsCompleted}\``,
        inline: true,
      },
      {
        name: "First / Last Login",
        value: `\`${stats.firstLogin} • ${stats.lastLogin}\``,
      },
    ];

    let skinUrl = await skinImage(playerUUID as string, "face");

    return (
      message.channel.send(
        this.client
          .templateEmbed()
          .setTitle(
            `<:${statusEmoji?.name}:${statusEmoji?.id}> ${
              stats.rank !== "Non" ? `[${stats.rank}]` : ""
            } ${stats.name} ${guild?.tag ? `[${guild.tag}]` : ""}`
          )
          .addFields(fields)
          .setColor(stats.plusColor)
          .attachFiles([{ name: "skin.png", attachment: skinUrl }])
          .setThumbnail("attachment://skin.png")
      ) && message.channel.stopTyping()
    );
  }
}

export default Hypixel;
