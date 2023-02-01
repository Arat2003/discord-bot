import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { getUserOrUUID } from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import skinImage from "../../util/wrappers/skinImage";

class Available extends Command {
  name = "available";
  aliases = ["availability", "taken"];
  category: Categories = "Minecraft";
  description = "Check if a Minecraft username is already taken.";
  usage = "<username>";

  async execute(message: Message, args: string[], prefix: string) {
    const embed = this.client.templateEmbed();
    if (!args.length) {
      message.channel.send({
        embeds: [this.client.usageEmbed(`${prefix}${this.name} ${this.usage}`)]
      });
    }

    let username = await getUserOrUUID(args[0]);
    if (username) {
      let skinUrl = skinImage(username.uuid, "face");
      embed
        .setTitle(`${username.name} is taken!`)
        .setThumbnail("attachment://skin.png");

      return message.channel.send({
        embeds: [embed],
        files: [{name: "skin.png", attachment: skinUrl}]
      });
    } else {
      embed
        .setTitle(`${args[0]} is available!`)
        .setDescription(
          "This username could also be on cooldown or banned/not allowed by Mojang."
        );

      return message.channel.send({embeds: [embed]});
    }
  }
}

export default Available;
