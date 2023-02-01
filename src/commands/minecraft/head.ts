import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { getUserOrUUID } from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../util/interfaces/responses";
import skinImage from "../../util/wrappers/skinImage";

class Head extends Command {
  name = "head";
  description = "Get someone's head.";
  category: Categories = "Minecraft";
  usage = "<username>";

  async execute(message: Message, args: string[]) {
    if (!args.length) {
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)]
      });
    }

    let user = await getUserOrUUID(args[0]);
    const embed = this.client.templateEmbed();
    if (user) {
      const skinUrl = skinImage(user.uuid, "head");
      embed
        .setTitle(`${user.name}'s head!`)
        .setThumbnail("attachment://skin.png")
        .addField(
          "1.13+",
          `\`/give @p minecraft:player_head{SkullOwner:"${user.name}"}\``
        )
        .addField(
          "1.12-",
          `\`/give @p minecraft:skull 1 3 {SkullOwner:"${user.name}"}\``
        );

      return message.channel.send({
        embeds: [embed],
        files: [{name: "skin.png", attachment: skinUrl}]
      });
    } else {
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)]
      });
    }
  }
}

export default Head;
