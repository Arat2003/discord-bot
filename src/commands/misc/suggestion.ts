import { Message, TextChannel } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Suggestion extends Command {
  name = "suggestion";
  aliases = ["suggest"];
  description = "Report an error or suggest a feature to the developers.";
  usage = "<suggestion>";
  category: Categories = "Misc";

  async execute(message: Message, args: string[]) {
    if (!args.length || args.length < 5) {
      const embed = this.client
        .templateEmbed()
        .setTitle("You can also join our support server!")
        .setURL(this.client.supportServer)
        .setDescription(
          "The suggestion has to be longer. Try being more specific please!"
        );

      return message.channel.send({embeds: [embed]});
    } else {
      let suggestionChannel = this.client.channels.cache.get(
        "732795770557694032"
      );
      let sug = args.join(" ");
      const embed = this.client.templateEmbed().addFields([
        { name: "New suggestion / report!", value: sug },
        {
          name: "Sent by:",
          value: `${message.author} (${message.author.tag})`,
        },
      ]);

      const embed2 = this.client
        .templateEmbed()
        .setTitle("You can also join our support server!")
        .setURL(this.client.supportServer)
        .setDescription(
          "Thanks for your report! It will be read as soon as possible ♥"
        );

      (suggestionChannel as TextChannel).send({embeds: [embed]});
      return message.channel.send({embeds: [embed2]});
    }
  }
}

export default Suggestion;
