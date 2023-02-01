import { Message, MessageEmbed } from "discord.js";
import Command from "../../structures/client/Command";
import beautify from "beautify";
import { Categories } from "../../util/interfaces/cmdCategories";

export default class Eval extends Command {
  name = "eval";
  description = "Evaluate code.";
  category: Categories = "Developer";
  usage = "<code>";
  devOnly = true;

  async execute(
    message: Message,
    args: string[],
    _prefix: string
  ): Promise<Message | undefined> {
    if (!args.length) return message.channel.send("watchu gon eval kid");

    try {
      const toEval = args.join(" ");
      if (toEval.includes("token")) return;

      const evaluated = eval(toEval);

      let embed: MessageEmbed = this.client
        .templateEmbed()
        .setTitle("Eval")
        .addField(
          "To evaluate:",
          `\`\`\`js\n${beautify(toEval, { format: "js" })}\n\`\`\``
        )
        .addField("Type of result:", typeof evaluated)
        .addField("Result:", evaluated.toString());

      return message.channel.send({embeds: [embed]});
    } catch (err) {
      let embed: MessageEmbed = this.client.errorEmbed(`${err}`);

      return message.channel.send({embeds: [embed]});
    }
  }
}
