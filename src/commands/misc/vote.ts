import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Vote extends Command {
  name = "vote";
  aliases = ["upvote"];
  usage = "";
  description = "Vote for the bot!";
  category: Categories = "Misc";

  async execute(message: Message) {
    const embed = this.client
      .templateEmbed()
      .setDescription(
        `You can vote for us with these two links: **\n[top.gg](https://top.gg/bot/720525129850814494/vote)\n[BFD](https://botsfordiscord.com/bot/720525129850814494/vote)**`
      );

    message.channel.send({embeds: [embed]});
  }
}

export default Vote;
