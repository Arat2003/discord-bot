import { ClientEvents, Guild } from "discord.js";
import Event from "../../structures/client/Event";
import GuildModel from "../../util/database/Guild";
import { DbGuild } from "../../util/interfaces/database";

class GuildCreateEvent extends Event {
  name: keyof ClientEvents = "guildCreate";

  async run(guild: Guild) {
    let addedGuild = await GuildModel.findOne({ guildID: guild.id });

    if (!addedGuild) {
      const newGuild = new GuildModel({
        guildID: guild.id,
        guildOwnerID: `${guild.ownerId}`,
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
