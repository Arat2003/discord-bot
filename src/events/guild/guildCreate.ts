import { Guild } from "discord.js";
import Event from "../../structures/client/Event";
import GuildModel from "../../util/database/Guild";
import { DbGuild } from "../../util/interfaces/database";

class GuildCreateEvent extends Event {
  name = "guildCreate";

  async run(guild: Guild) {
    let addedGuild = await GuildModel.findOne({ guildID: guild.id });

    if (!addedGuild) {
      const newGuild = new GuildModel({
        guildID: guild.id,
        guildOwnerID: `${guild.owner?.id}`,
        language: "en",
        prefix: "h!",
        ignoredChannels: [],
        prefixChangeAllowedRoles: [],
      } as DbGuild);

      newGuild.save();
    }
  }
}

export default GuildCreateEvent;
