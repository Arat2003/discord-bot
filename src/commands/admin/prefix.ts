import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import GuildModel from "../../util/database/Guild";
import { Categories } from "../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../util/interfaces/responses";

class Prefix extends Command {
  name = "prefix";
  aliases = ["setprefix"];
  description = "Change the bot's prefix with which commands are triggered.";
  category: Categories = "Admin";
  adminOnly = true;
  usage = "<newPrefix>";

  async execute(message: Message, args: string[], prefix: string) {
    if (!args.length) {
      let embed = this.client
        .templateEmbed()
        .setDescription(
          `The current prefix is \`${prefix}\`. If you want to change the prefix make sure you add one.`
        );

      return message.channel.send(embed);
    } else if (args.length > 1) {
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.MORE_THAN_ENOUGH_ARGS)
      );
    } else {
      const g = await GuildModel.findOne({ guildID: message.guild?.id });

      g!.prefix = args[0];

      await g?.save();

      let embed = this.client
        .templateEmbed()
        .setDescription(`Prefix successfully updated to \`${args[0]}\`.`)
        .setTimestamp();

      return message.channel.send(embed);
    }
  }
}

export default Prefix;
