import { EmbedField, Message } from "discord.js";
import Command from "../../../structures/client/Command";
import { addCommas } from "../../../util/functions/textFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import watchdogWrapper from "../../../util/wrappers/watchdog";

class Watchdog extends Command {
  name = "watchdog";
  aliases = ["wd", "bans", "banhammer"];
  category: Categories = "Hypixel";
  description = "Get Hypixel's Watchdog stats.";
  usage = "";

  async execute(message: Message): Promise<Message | void> {
    let wd = await watchdogWrapper();

    if (wd) {
      const stats: EmbedField[] = [
        {
          name: "Watchdog",
          value: `**Total Bans**: \`${addCommas(wd.watchdog_total)}\`
        \n **Bans Today**: \`${addCommas(wd.watchdog_rollingDaily)}\`
        \n **Bans Last Minute**: \`${addCommas(wd.watchdog_lastMinute)}\``,
          inline: true,
        },
        {
          name: "Staff",
          value: `**Total Bans**: \`${addCommas(wd.staff_total)}\`
          \n **Bans Today**: \`${addCommas(wd.staff_rollingDaily)}\``,
          inline: true,
        },
      ];

      let embed = this.client
        .templateEmbed()
        .addFields(stats)
        .setTitle("Hypixel Ban Stats");

      return message.channel.send(embed);
    }
  }
}

export default Watchdog;
