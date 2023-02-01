import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";
import UserModel from "../../util/database/User";

class Unverify extends Command {
  name = "unverify";
  description = "Unlink your account from this bot.";
  category: Categories = "Hypixel";
  usage = "";
  aliases = ["unlink"];

  async execute(message: Message) {
    const user = await UserModel.findOneAndDelete({
      userID: message.author.id,
    });

    if (!user) {
      return message.channel.send({
        embeds: [this.client.errorEmbed("You're not verified yet!")]
      });
    } else {
      return message.channel.send({
        embeds: [
          this.client
            .templateEmbed()
            .setDescription(
              "You've successfully unlinked your account from this bot."
            )
        ]
      });
    }
  }
}

export default Unverify;
