import { Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class ChatChannel extends Command {
  name = "chatChannel";
  aliases = ["channel", "chatchannel"];
  usage = "[username]";
  description = "Check what chat channel the user is typing in by default.";
  category: Categories = "Hypixel";

  async execute(message: Message, args: string[]): Promise<Message | void> {
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
    let skinUrl = skinImage(playerUUID, "face");
    const statusEmoji =
      player.parsed.status === "Online"
        ? this.client.getEmoji("online", "begger")
        : this.client.getEmoji("offline", "begger");

    let embed = this.client
      .templateEmbed()
      .setDescription(
        `\`${player.parsed.name}\` ${
          player.channel
            ? `is sending his messages to the ** ${player.channel.toLowerCase()}** channel by default.`
            : "is sending his messages to an **unknown** channel (which means they probably disabled it in-game)."
        }`
      )
      .setThumbnail("attachment://skin.png")
      .setTitle(
        `<:${statusEmoji?.name}:${statusEmoji?.id}> ${
          player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""
        } ${player.parsed.name}`
      )
      .setColor(player.parsed.plusColor);
    return message.channel.send({
      embeds: [embed],
      files: [{name: "skin.png", attachment: skinUrl}]
    });
  }
}

export default ChatChannel;
