import chalk from "chalk";
import { Guild } from "discord.js";
import Event from "../../structures/client/Event";
import GuildModel from "../../util/database/Guild";

class GuildDeleteEvent extends Event {
  name = "guildDelete";

  async run(guild: Guild) {
    let removedGuild = await GuildModel.findOne({ guildID: guild.id });

    if (!removedGuild) return;
    else {
      await removedGuild.remove();
      console.log(
        chalk.magenta(
          `[BOT REMOVED] - ${guild.name} with ${guild.memberCount} users. Owner: ${guild.owner}`
        )
      );
    }
  }
}

export default GuildDeleteEvent;
