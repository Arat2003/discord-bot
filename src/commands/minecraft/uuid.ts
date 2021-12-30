import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import {
  uuidToUserCache,
  getUserOrUUID,
  formatTrimmedUuid,
} from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../util/interfaces/responses";
import skinImage from "../../util/wrappers/skinImage";

class UUID extends Command {
  name = "uuid";
  description = "Get a user's unique identifier.";
  category: Categories = "Minecraft";
  usage = "<username>";

  async execute(message: Message, args: string[]): Promise<Message> {
    if (!args.length) {
      return message.channel.send(
        this.client.errorEmbed(`${ErrorResponses.WRONG_OR_MISSING_USER}`)
      );
    }

    let playerUUID = await getUserOrUUID(args[0]);

    if (!playerUUID) {
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );
    }

    let username = uuidToUserCache.get(playerUUID?.uuid as string);
    let fullUUID = formatTrimmedUuid(playerUUID?.uuid as string);
    let skinUrl = skinImage(playerUUID?.uuid as string, "face");

    let embed = this.client
      .templateEmbed()
      .addFields([
        { name: "Username", value: `\`${username}\`` },
        {
          name: "Universally Unique Identifier (UUID)",
          value: `\`${fullUUID}\``,
        },
        { name: "Trimmed UUID", value: `\`${playerUUID.uuid}\`` },
      ])
      .attachFiles([{ name: "skin.png", attachment: skinUrl }])
      .setThumbnail("attachment://skin.png");

    return message.channel.send(embed);
  }
}

export default UUID;
