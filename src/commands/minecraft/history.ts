import chalk from "chalk";
import { Message } from "discord.js";
import moment from "moment";
import fetch from "node-fetch";
import Command from "../../structures/client/Command";
import {
  getUserOrUUID,
  ProfileRes,
} from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../util/interfaces/responses";
import skinImage from "../../util/wrappers/skinImage";

class History extends Command {
  name = "history";
  description = "User's name history.";
  category: Categories = "Minecraft";
  usage = "<username>";

  async execute(message: Message, args: string[]) {
    if (!args.length) {
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );
    } else {
      const user = await getUserOrUUID(args[0]);
      if (user) {
        const nameHistory: ProfileRes = await (
          await fetch(`https://api.ashcon.app/mojang/v2/user/${args[0]}`)
        )
          .json()
          .catch((err) =>
            console.log(
              chalk.red.bold("[Name History CMD] ") + chalk.red(`${err}`)
            )
          );

        const desc = nameHistory.username_history.map(
          (name) =>
            `**${name.username}** (${
              name.changed_at
                ? moment(name.changed_at).format("MM/DD/YYYY")
                : moment(nameHistory.created_at).format("MM/DD/YYYY")
            })`
        );

        const skinUrl = skinImage(user.uuid, "face");
        const embed = this.client
          .templateEmbed()
          .setTitle(`${user.name}'s name history:`)
          .setDescription(desc)
          .attachFiles([{ name: "skin.png", attachment: skinUrl }])
          .setThumbnail("attachment://skin.png");

        return message.channel.send(embed);
      } else {
        return message.channel.send(
          this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
        );
      }
    }
  }
}

export default History;
