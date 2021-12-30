import chalk from "chalk";
import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import UserModel from "../../util/database/User";
import { uuidToUserCache } from "../../util/functions/mcUuidFunctions";
import { addCommas } from "../../util/functions/textFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";

class Botstats extends Command {
  name = "botstats";
  aliases = ["bs", "botstat", "ping"];
  description = "Learn more about the bot.";
  category: Categories = "Misc";
  usage = "";

  async execute(message: Message) {
    const date = Date.now();

    let linkedUsers;
    await UserModel.countDocuments({}, (e, count) => {
      if (e) {
        console.log(
          chalk.red.bold("[LINKED USER DOC COUNT BOTSTATS] ") + chalk.red(e)
        );
      }
      linkedUsers = count;
    });

    let uptimeSeconds = this.client.uptime! / 1000;
    let uptimeDays = Math.floor(uptimeSeconds / 86400);
    uptimeSeconds %= 86400;
    let uptimeHours = Math.floor(uptimeSeconds / 3600);
    uptimeSeconds %= 3600;
    let uptimeMinutes = Math.floor(uptimeSeconds / 60);
    uptimeSeconds %= 60;
    const uptime =
      uptimeDays > 0
        ? `${uptimeDays != 1 ? `${uptimeDays} days` : `${uptimeDays} day`}, ${
            uptimeHours != 1 ? `${uptimeHours} hrs` : `${uptimeHours} hour`
          }, ${
            uptimeMinutes != 1
              ? `${uptimeMinutes} mins`
              : `${uptimeMinutes} min`
          }, and ${
            uptimeSeconds != 1
              ? `${Math.floor(uptimeSeconds)} secs`
              : `${uptimeSeconds} sec`
          }`
        : uptimeHours > 0
        ? `${
            uptimeHours != 1 ? `${uptimeHours} hrs` : `${uptimeHours} hour`
          }, ${
            uptimeMinutes != 1
              ? `${uptimeMinutes} mins`
              : `${uptimeMinutes} min`
          }, and ${
            uptimeSeconds != 1
              ? `${Math.floor(uptimeSeconds)} secs`
              : `${uptimeSeconds} sec`
          }`
        : uptimeMinutes > 0
        ? `${
            uptimeMinutes != 1
              ? `${uptimeMinutes} mins`
              : `${uptimeMinutes} min`
          }, and ${
            uptimeSeconds != 1
              ? `${Math.floor(uptimeSeconds)} secs`
              : `${uptimeSeconds} sec`
          }`
        : `${Math.floor(uptimeSeconds)} secs`;

    const ping = Math.abs(date - Date.now());

    let fields = [
      { name: "Ping", value: `\`${this.client.ws.ping}ms\``, inline: true },
      { name: "Avg. respose time", value: `\`${ping}ms\``, inline: true },
      { name: "Uptime", value: `\`${uptime}\``, inline: true },
      {
        name: "Guild Count",
        value: `\`${addCommas(`${this.client.guilds.cache.size}`)}\``,
        inline: true,
      },
      {
        name: "Linked Accounts",
        value: `\`${linkedUsers ? addCommas(`${linkedUsers}`) : 0}\``,
        inline: true,
      },
      {
        name: "Name & UUID cache",
        value: `\`${uuidToUserCache.keys().length}\``,
        inline: true,
      },
      {
        name: "Memory Usage",
        value: `\`${(
          Object.values(process.memoryUsage()).reduce((x, y) => x + y) /
          Math.pow(1024, 2)
        ).toFixed(2)} MB\``,
        inline: true,
      },
      { name: "Library", value: "`discord.js 12.5.1`", inline: true },
    ];

    const embed = this.client
      .templateEmbed()
      .addFields(fields)
      .setDescription(
        "A Hypixel Bot created for those who want to know their in-game stats!\nWe are not affiliated with Hypixel nor Mojang."
      )
      .setAuthor("Minestats", this.client.user!.displayAvatarURL());

    message.channel.send(embed);
  }
}

export default Botstats;
