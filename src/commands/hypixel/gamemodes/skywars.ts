import { Message, TextChannel, EmbedField } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import skyWarsWrapper from "../../../util/wrappers/gamemodes/skywars";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class SkyWars extends Command {
  name = "skywars";
  aliases = ["sw"];
  description = "Player's SkyWars stats";
  category: Categories = "Player";
  usage = "[username]";
  stats = true;

  async execute(message: Message, args: string[]) {
    message.channel.sendTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;

    if (args.length >= 1) {
      let a = await getUserOrUUID(args[0]);
      playerUUID = a?.uuid;
    } else if (!user && !args.length) {
      return (
        message.channel.send({
          embeds: [
            this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
          ]
        })
      );
    } else {
      playerUUID = user?.minecraftUUID;
    }

    if (!playerUUID) {
      return (
        message.channel.send({
          embeds: [
            this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
          ]
        })
      );
    }

    const player = await playerWrapper(playerUUID as string);

    if (!player) {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)
        ]
      });
    }

    const skinUrl = skinImage(playerUUID, "face");
    const stats = skyWarsWrapper(player.stats.SkyWars);

    let pages = [
      { arr: createArrays(stats, "overall", "", false), desc: "Overall" },
      { arr: createArrays(stats, "solos", "Normal", true), desc: "Solos" },
      { arr: createArrays(stats, "teams", "Normal", true), desc: "Teams" },
      { arr: createArrays(stats, "ranked", "Ranked", false), desc: "Ranked" },
    ];

    const embeds = pages.map((page) => {
      const embed = this.client
        .templateEmbed()
        .setColor(player.parsed.plusColor)
        .addFields(page.arr)
        .setTitle(
          `${player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""} ${
            player.parsed.name
          }`
        )
        .setDescription(`Sky Wars - **${page.desc}**`)
        .setThumbnail("attachment://img.png");

      return embed;
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds, skinUrl);
    pagination.paginate(60000);
    return;
  }
}

export default SkyWars;

function createArrays(
  stats: any,
  type: string,
  nameSuffix: string,
  insane: boolean
) {
  const arr: EmbedField[] = [
    { name: `☆`, value: `\`${stats.level}\``, inline: true },
    { name: `Coins`, value: `\`${stats.coins}\``, inline: true },
    { name: `Souls`, value: `\`${stats.souls}\``, inline: true },
    {
      name: `${nameSuffix} Kills`,
      value: `\`${stats[type][`${insane ? "normalKills" : "kills"}`]}\``,
      inline: true,
    },
    {
      name: `${nameSuffix} Deaths`,
      value: `\`${stats[type][`${insane ? "normalDeaths" : "deaths"}`]}\``,
      inline: true,
    },
    {
      name: `${nameSuffix} KDR`,
      value: `\`${stats[type][`${insane ? "normalKdr" : "kdr"}`]}\``,
      inline: true,
    },
    {
      name: `${nameSuffix} Wins`,
      value: `\`${stats[type][`${insane ? "normalWins" : "wins"}`]}\``,
      inline: true,
    },
    {
      name: `${nameSuffix} Losses`,
      value: `\`${stats[type][`${insane ? "normalLosses" : "losses"}`]}\``,
      inline: true,
    },
    {
      name: `${nameSuffix} WLR`,
      value: `\`${stats[type][`${insane ? "normalWlr" : "wlr"}`]}\``,
      inline: true,
    },
  ];

  if (insane) {
    arr.push(
      {
        name: "Insane Kills",
        value: `\`${stats[type]["insaneKills"]}\``,
        inline: true,
      },
      {
        name: "Insane Deaths",
        value: `\`${stats[type]["insaneDeaths"]}\``,
        inline: true,
      },
      {
        name: "Insane KDR",
        value: `\`${stats[type]["insaneKdr"]}\``,
        inline: true,
      },
      {
        name: "Insane Wins",
        value: `\`${stats[type]["insaneWins"]}\``,
        inline: true,
      },
      {
        name: "Insane Losses",
        value: `\`${stats[type]["insaneLosses"]}\``,
        inline: true,
      },
      {
        name: "Insane WLR",
        value: `\`${stats[type]["insaneWlr"]}\``,
        inline: true,
      }
    );
  }

  return arr;
}
