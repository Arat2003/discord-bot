import chalk from "chalk";
import { Message, Util } from "discord.js";
import _ from "lodash";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { addCommas } from "../../../util/functions/textFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { HypixelGuild } from "../../../util/interfaces/ParsedObjects/ParsedGuild";
import { ErrorResponses } from "../../../util/interfaces/responses";
import guildWrapper from "../../../util/wrappers/guild";

class Weekly extends Command {
  name = "weekly";
  description = "Weekly GXP earners leaderboard.";
  category: Categories = "Guild";
  usage = "<guildName | -p username> [users shown: 0-125 | all]";
  stats = true;

  async execute(message: Message, args: string[], prefix: string) {
    message.channel.startTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;
    let guild: HypixelGuild | null;

    let waitMessage = await message.channel.send(this.client.waitEmbed());

    let totalEntries: number;
    if (args[args.length - 1].toLowerCase() === "all") {
      args[args.length - 1] = "125";
    }

    if (!Number(args[args.length - 1])) {
      totalEntries = 10;
    } else {
      totalEntries = Number(args.pop());
    }

    if (args.includes("-p")) {
      if (args.length === 2) {
        playerUUID = (await getUserOrUUID(args[1]))!.uuid;
      } else if (user && args.length === 1) {
        playerUUID = user.minecraftUUID;
      } else if (!user && args.length < 2) {
        return (
          message.channel.send(
            this.client.usageEmbed(
              `The correct usage for the command is **${prefix}${this.name} ${this.usage}**.`
            )
          ) &&
          waitMessage.delete() &&
          message.channel.stopTyping()
        );
      }

      if (!playerUUID) {
        return (
          message.channel.send(
            this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
          ) &&
          waitMessage.delete() &&
          message.channel.stopTyping()
        );
      }

      guild = await guildWrapper(playerUUID, "player");
      if (!guild) {
        waitMessage.delete();
        message.channel.stopTyping();
        return message.channel.send(
          this.client.errorEmbed(ErrorResponses.USER_NOT_IN_A_HYPIXEL_GUILD)
        );
      }
    } else if (args.length > 0) {
      let joinedArgs = args.join("+");
      guild = await guildWrapper(joinedArgs, "name");
      if (!guild) {
        waitMessage.delete();
        message.channel.stopTyping();
        return message.channel.send(
          this.client.errorEmbed(ErrorResponses.WRONG_GUILD)
        );
      }
    } else {
      waitMessage.delete();
      message.channel.stopTyping();
      return message.channel.send(
        this.client.usageEmbed(
          `The correct usage for the command is **${prefix}${this.name} ${this.usage}**.`
        )
      );
    }

    function format(array: any): string[] {
      let i = 0;

      const withSpaces = array.map((x: any) => `\`#${++i}\` ${x}`);
      const entriesPerLines = Math.floor(array.length / 3) + 1;

      return _.chunk(withSpaces, entriesPerLines).map((x) => x.join("\n"));
    }

    let weeklyXP: WeeklyMember[] = [];

    for (const member of guild.guildMembers) {
      weeklyXP.push([
        member.uuid,
        Object.values(member.expHistory).reduce((a, b) => a + b),
      ]);
    }

    weeklyXP.sort((a, b) => b[1] - a[1]);

    let leaderboard = weeklyXP.slice(0, totalEntries);

    for (const member of leaderboard) {
      member[0] = Util.escapeMarkdown(
        `${(await getUserOrUUID(member[0]))?.name}`
      );
    }

    const embed = this.client
      .templateEmbed()
      .setTitle(`${guild?.name}'s Top ${totalEntries} Weekly GXP Accumulators`)
      .setDescription(
        `\`\`\`c\nTotal Weekly Raw GXP: ${addCommas(
          `${guild.weeklyXP}`
        )}\nTotal Weekly Scaled GXP: ${addCommas(
          `${guild.scaledWeekly}`
        )} (Approximate value)\`\`\``
      )
      .setColor(guild!.hexColor)
      .addFields(
        format(leaderboard.map((x) => `${x[0]}: ${addCommas(`${x[1]}`)}`)).map(
          (x) => {
            return {
              name: "\uFEFF",
              value: x,
              inline: true,
            };
          }
        )
      );

    waitMessage.delete();
    message.channel.send(embed).catch((e) => {
      console.log(chalk.red.bold("[WEEKLY COMMAND]: ") + chalk.red(`${e}`));
      message.channel.send(this.client.commandErrorEmbed());
    });
    message.channel.stopTyping();
    return;
  }
}

type WeeklyMember = [string, number];

export default Weekly;
