import { EmbedField, Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";
import fetch from "node-fetch";
import { addCommas } from "../../util/functions/textFunctions";

class Server extends Command {
  name = "server";
  aliases = ["sv", "si"];
  description = "Get a server's information.";
  category: Categories = "Minecraft";
  usage = "<serverIP>";

  async execute(message: Message, args: string[], prefix: string) {
    if (!args.length)
      return message.channel.send({
        embeds: [this.client.usageEmbed(`${prefix}${this.name} ${this.usage}`)]
      });

    const serverInfo = await fetch(
      `https://eu.mc-api.net/v3/server/ping/${args[0]}`
    ).then((r) => r.json());

    if (serverInfo.error)
      return message.channel.send({
        embeds: [this.client.errorEmbed("You've provided an invalid IP address.")]
      });

    const playersOnline = addCommas(`${serverInfo.players.online}`);
    const playersMax = addCommas(`${serverInfo.players.max}`);
    const version = serverInfo.version.name
      ? serverInfo.version.name.replace(/Requires MC/, "").replace(/§./g, "")
      : "Null";

    const MOTDR = serverInfo.description ? serverInfo.description : null;
    const MOTDT = serverInfo.description.text
      ? serverInfo.description.text
      : MOTDR;
    const MOTDE = serverInfo.description.extra
      ? serverInfo.description.extra.map((ex: any) => ex.text).join(" ")
      : MOTDT;
    const MOTD = MOTDE ? MOTDE.replace(/§./g, "") : "";

    const serverIcon = serverInfo.favicon
      ? serverInfo.favicon
      : "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png";
    const serverFields: EmbedField[] = [
      {
        name: "Status",
        value: serverInfo.online ? "Online" : "Offline",
        inline: false,
      },
      { name: "Server Address", value: args[0], inline: false },
      {
        name: "Players Online/Max",
        value: `${playersOnline}/${playersMax}`,
        inline: true,
      },
      { name: "Version", value: version, inline: true },
      { name: "MOTD", value: MOTD, inline: false },
    ];

    return message.channel.send({
      embeds: [
        this.client
          .templateEmbed()
          .addFields(serverFields)
          .setThumbnail("attachment://icon.png")
      ],
      files: [{name: "icon.png", attachment: serverIcon}]
    });
  }
}

export default Server;
