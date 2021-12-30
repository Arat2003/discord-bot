import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Support extends Command {
  name = "support";
  usage = "";
  description =
    "Join the support server in case you have any doubts or want to report an error.";
  category: Categories = "Misc";

  async execute(message: Message) {
    const embed = this.client
      .templateEmbed()
      .setDescription(
        `You can use this [link](${this.client.supportServer}) to join the support server.`
      );

    message.channel.send(embed);
  }
}

export default Support;
