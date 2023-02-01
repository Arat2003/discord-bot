import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Colorcodes extends Command {
  name = "colorcodes";
  description = "Minecraft color codes";
  usage = "";
  category: Categories = "Minecraft";

  async execute(message: Message) {
    const embed = this.client
      .templateEmbed()
      .addField(
        "Color Codes",
        `Black: §0
      Dark Blue: §1
      Dark Green: §2
      Dark Aqua: §3
      Dark Red: §4
      Dark Purple: §5
      Gold: §6
      Gray: §7`,
        true
      )
      .addField(
        "Color Codes",
        `Dark Gray: §8
      Blue: §9
      Green: §a
      Aqua: §b
      Red: §c
      Light Purple: §d
      Light Yellow: §e
      White: §f`,
        true
      )
      .addField(
        "Formatting Codes",
        `Obfuscated: §k
      **Bold:** §l
      ~~Strikethrough:~~ §m
      __Underlined:__ §n
      *Itallic*: §o
      Reset: §r`,
        true
      )
      .setDescription(
        "Text in Minecraft can be formatted in certain servers that allow it by using different codes and the sign `§`."
      );

    return message.channel.send({embeds: [embed]});
  }
}

export default Colorcodes;
