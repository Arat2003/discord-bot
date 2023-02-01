import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Achievement extends Command {
  name = "achievement";
  category: Categories = "Minecraft";
  description = "Generate a random achievement.";
  usage = "<description>";

  async execute(message: Message, args: string[]): Promise<Message | void> {
    if (!args.length) {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(
            "You need to include the achievement's description."
          )
        ]
      });
    }

    let input = args.join(" ");
    let achievementUrl = `https://minecraftskinstealer.com/achievement/${Math.floor(
      Math.random() * Math.floor(39)
    )}/Achievement%20Unblocked/${encodeURI(input)}`;

    return message.channel.send({
      embeds: [
        this.client
          .templateEmbed()
          .setImage("attachment://achievement.png")
      ],
      files: [{name: "achievement.png", attachment: achievementUrl}]
    });
  }
}

export default Achievement;
