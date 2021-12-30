import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { getUserOrUUID } from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../util/interfaces/responses";
import skinImage from "../../util/wrappers/skinImage";

class Skin extends Command {
  name = "skin";
  description = "Download someone's skin.";
  category: Categories = "Minecraft";
  usage = "<username>";

  async execute(message: Message, args: string[]) {
    if (!args.length)
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );

    let user = await getUserOrUUID(args[0]);

    if (user) {
      const skinUrl = skinImage(user.uuid, "skin");
      const fullUrl = skinImage(user.uuid, "full");
      const embed = this.client
        .templateEmbed()
        .setTitle(`${user.name}'s skin:`)
        .attachFiles([
          { name: "full.png", attachment: fullUrl },
          { name: "skin.png", attachment: skinUrl },
        ])
        .setThumbnail("attachment://skin.png")
        .setImage("attachment://full.png");

      return message.channel.send(embed);
    } else {
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );
    }
  }
}

export default Skin;
