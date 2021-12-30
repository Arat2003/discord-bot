import { EmbedField, Message, TextChannel } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import {
  addCommas,
  styleGamemodes,
} from "../../../util/functions/textFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { HypixelGuild } from "../../../util/interfaces/ParsedObjects/ParsedGuild";
import { ErrorResponses } from "../../../util/interfaces/responses";
import guildWrapper from "../../../util/wrappers/guild";

class Guild extends Command {
  name = "guild";
  category: Categories = "Guild";
  stats = true;
  description = "Get a guild's stats.";
  usage = "<guildName or -p username>";

  async execute(
    message: Message,
    args: string[],
    prefix: string
  ): Promise<Message | void> {
    message.channel.startTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;
    let guild: HypixelGuild | null;

    let waitMessage = await message.channel.send(this.client.waitEmbed());

    if (args.includes("-p")) {
      if (args.length >= 2) {
        playerUUID = (await getUserOrUUID(args[1]))!.uuid;
      } else if (user && args.length === 1) {
        playerUUID = user.minecraftUUID;
      } else if (!user && args.length === 1) {
        return (
          message.channel.send(
            this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
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

    let mostPlayedGamemodes: string[] = [];
    if (guild.preferredGames) {
      mostPlayedGamemodes = styleGamemodes(guild.preferredGames.join(","));
    }

    let gamemodesTxt = "";
    if (mostPlayedGamemodes) {
      mostPlayedGamemodes.map(
        (gamemode) => (gamemodesTxt += `\`-\` ${gamemode}\n`)
      );
    }

    let dailyXPTxt = "";
    for (const [day, xp] of Object.entries(guild.dailyXP)) {
      dailyXPTxt += `\`-\` ${day}: **${addCommas(
        `${xp.scaled}`
      )}** / ${addCommas(`${xp.raw}`)}\n`;
    }

    let guildRanks = guild.ranks
      ? guild.ranks.sort((a, b) => b.priority - a.priority)
      : null;

    let ranksTxt = "";

    if (guildRanks) {
      guildRanks.map(
        (rank) =>
          (ranksTxt += `\`-\` ${rank.name} ${
            rank.tag ? `[${rank.tag}]` : ""
          }\n`)
      );
    }

    let gm = (await getUserOrUUID(guild.guildMaster))?.name;

    let page1: EmbedField[] = [
      { name: "Guild Master", value: `\`${gm}\``, inline: true },
      { name: "Created on", value: `\`${guild.createdOn}\``, inline: true },
      {
        name: "Tag",
        value: `\`${guild.tag ? `[${guild.tag}]` : "Null"}\``,
        inline: true,
      },
      { name: "Level", value: `\`${guild.exp.level}\``, inline: true },
      {
        name: "GXP needed to level up",
        value: `\`${addCommas(`${guild.exp.xpNeeded}`)!.replace("-", "")}\``,
        inline: true,
      },
      { name: "Members", value: `\`${guild.memberCount}/125\``, inline: true },
      {
        name: "Daily GXP (Scaled / Raw)",
        value: `${dailyXPTxt}`,
        inline: true,
      },
      {
        name: "Weekly GXP (Scaled / Raw)",
        value: `\`-\` **${addCommas(
          `${guild.scaledWeekly.toFixed(1)}`
        )!.replace(".0", "")}** / ${addCommas(`${guild.weeklyXP}`)}`,
        inline: true,
      },
    ];

    let page2: EmbedField[] = [
      {
        name: "Ranks",
        value: ranksTxt !== "" ? ranksTxt : "N/A",
        inline: true,
      },
      {
        name: "Preferred Gamemodes",
        value: gamemodesTxt !== "" ? gamemodesTxt : "N/A",
        inline: true,
      },
    ];

    let pages = [page1, page2];

    const embeds = pages.map((page) => {
      let embed = this.client
        .templateEmbed()
        .setTitle(`${guild!.name} ${guild!.tag ? `[${guild!.tag}]` : ""}`)
        .setColor(guild!.hexColor)
        .addFields(page);

      return embed;
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds);
    waitMessage.delete();
    pagination.paginate(60000);
    message.channel.stopTyping();
    return;
  }
}

export default Guild;
