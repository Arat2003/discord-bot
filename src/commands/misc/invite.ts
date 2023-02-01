import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Invite extends Command {
  name = "invite";
  usage = "";
  description = "Invitation link for you to add the bot to a server.";
  category: Categories = "Misc";

  async execute(message: Message) {
    const embed = this.client
      .templateEmbed()
      .setDescription(
        `You can use this [link](${this.client.inviteLink}) to invite the bot to any of your servers.`
      );

    message.channel.send({embeds: [embed]});
  }
}

export default Invite;
