import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";
import statusWrapper from "../../../util/wrappers/status";

class Status extends Command {
  name = "status";
  description =
    "Displays the status and game of the requested user. Users can choose to not show their status within the API ingame.";
  category: Categories = "Hypixel";
  usage = "[username]";

  async execute(message: Message, args: string[]) {
    message.channel.startTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;

    if (args.length >= 1) {
      let a = await getUserOrUUID(args[0]);
      playerUUID = a?.uuid;
    } else if (!user && !args.length) {
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
      );
    } else {
      playerUUID = user?.minecraftUUID;
    }

    if (!playerUUID) {
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );
    }

    const player = await playerWrapper(playerUUID);
    const status = await statusWrapper(playerUUID);

    let statusText = status.online ? "online" : "offline";
    const fields: EmbedField[] = [
      {
        name: "Gametype",
        value: status.gameType ? `\`${status.gameType}\`` : "`N/A`",
        inline: true,
      },
      {
        name: "Gamemode",
        value: status.mode ? `\`${status.mode}\`` : "`N/A`",
        inline: true,
      },
      {
        name: "Map",
        value: status.map ? `\`${status.map}\`` : "`N/A`",
        inline: true,
      },
    ];

    let skinUrl = skinImage(playerUUID, "face");
    const statusEmoji =
      player.parsed.status === "Online"
        ? this.client.getEmoji("online", "begger")
        : this.client.getEmoji("offline", "begger");

    let embed = this.client
      .templateEmbed()
      .addField("Status", `${player.parsed.name} is **${statusText}**.`)
      .addFields(fields)
      .attachFiles([{ name: "skin.png", attachment: skinUrl }])
      .setThumbnail("attachment://skin.png")
      .setTitle(
        `<:${statusEmoji?.name}:${statusEmoji?.id}> ${
          player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""
        } ${player.parsed.name}`
      )
      .setColor(player.parsed.plusColor);
    return message.channel.send(embed) && message.channel.stopTyping();
  }
}

export default Status;
