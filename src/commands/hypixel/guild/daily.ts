import { Message, TextChannel, Util } from "discord.js";
import _ from "lodash";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { addCommas } from "../../../util/functions/textFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { HypixelGuild } from "../../../util/interfaces/ParsedObjects/ParsedGuild";
import { ErrorResponses } from "../../../util/interfaces/responses";
import guildWrapper from "../../../util/wrappers/guild";

class Daily extends Command {
  name = "daily";
  description = "Daily GXP earners leaderboard.";
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

    const days: any = [];
    const totalXpByDay: any = [];

    for (const member of guild.guildMembers) {
      for (const date in member.expHistory) {
        if (Object.prototype.hasOwnProperty.call(member.expHistory, date)) {
          const element = member.expHistory[date];

          const index = Object.keys(member.expHistory).indexOf(date);
          const toBePushed = [
            member.uuid,
            typeof element === "number" ? element : 0,
          ];

          if (!days[index]) {
            days.push([toBePushed]);
          } else days[index].push(toBePushed);

          days[index].sort((a: DailyMember, b: DailyMember) => b[1] - a[1]);

          if (!totalXpByDay[index]) {
            totalXpByDay[index] = [
              guild.dailyXP[date].raw,
              guild.dailyXP[date].scaled,
            ];
          }
        }
      }
    }

    let leaderboard = days.map((day: DailyMember[]) =>
      day.slice(0, totalEntries)
    );

    for (const day of leaderboard) {
      for (let user of day) {
        user[0] = Util.escapeMarkdown(
          `${(await getUserOrUUID(user[0]))?.name}`
        );
      }
    }

    const embeds = leaderboard.map((x: DailyMember[], i: number) => {
      return this.client
        .templateEmbed()
        .setTitle(
          `${guild?.name}'s Top ${totalEntries} Daily GXP Accumulators - ${
            i === 0 ? "Today" : i === 1 ? "Yesterday" : `${i + 1} days ago`
          }`
        )
        .setColor(guild!.hexColor)
        .setDescription(
          `\`\`\`c\nTotal Daily Raw GXP: ${addCommas(
            `${totalXpByDay[i][0]}`
          )}\nTotal Daily Scaled GXP ${addCommas(
            `${totalXpByDay[i][1]}`
          )}\`\`\``
        )
        .addFields(
          format(x.map((y) => `${y[0]}: ${addCommas(`${y[1]}`)}`)).map((y) => {
            return {
              name: "\uFEFF",
              value: y,
              inline: true,
            };
          })
        );
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds);
    waitMessage.delete();
    pagination.paginate(60000);
    message.channel.stopTyping();
    return;
  }
}

type DailyMember = [string, number];

export default Daily;
