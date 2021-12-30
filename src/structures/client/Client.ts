import { Client, Collection, GuildEmoji, MessageEmbed } from "discord.js";
import Command from "./Command";
import Event from "./Event";
import Loader from "./Loader";
import { footer, color, assets } from "../../util/botConstants.json";
import { dbLogin, expressListener } from "../../util/functions/startFunctions";
import { emojiServerNames } from "../../util/interfaces/fetchTypes";

export default class MinestatsClient extends Client {
  commands: Collection<string, Command> = new Collection();
  events: Collection<string, Event> = new Collection();
  loader: Loader = new Loader(this);

  getEmoji: (
    name: string,
    server: emojiServerNames
  ) => GuildEmoji | undefined = (name, server) => {
    let guildID =
      server.toLowerCase() == "begger"
        ? "719765036054216765"
        : "726286548240302133";
    let guild = this.guilds.cache.get(guildID);
    let emoji = guild?.emojis.cache.find((emoji) => emoji.name === name);

    return emoji;
  };

  templateEmbed: () => MessageEmbed = () => {
    return new MessageEmbed().setFooter(footer).setColor(color);
  };

  errorEmbed: (desc: string) => MessageEmbed = (desc) => {
    return new MessageEmbed()
      .setFooter(footer)
      .setColor(color)
      .setThumbnail(assets.error)
      .setDescription(desc);
  };

  commandErrorEmbed: () => MessageEmbed = () => {
    return new MessageEmbed()
      .setFooter(footer)
      .setColor(color)
      .setThumbnail(assets.error)
      .setDescription(
        "There was an error executing the command. Please try again later.\nThe issue was broadcasted to the developers and if it persists, join the [support server](https://discord.gg/HjXB4HW)."
      );
  };

  usageEmbed: (usage: string) => MessageEmbed = (usage) => {
    return new MessageEmbed()
      .setFooter(footer)
      .setColor(color)
      .setThumbnail(assets.error)
      .setTitle("Wrong usage!")
      .setDescription(
        `Tip: [] means optional, while <> is a required argument.\n\n**The correct usage is:**\n\`${usage}\``
      );
  };

  waitEmbed: () => MessageEmbed = () => {
    return new MessageEmbed()
      .setFooter(footer)
      .setColor(color)
      .setTitle("Loading results...")
      .setDescription("This may take a while.");
  };

  inviteLink: string =
    "https://discord.com/oauth2/authorize?client_id=720525129850814494&permissions=388160&scope=bot";

  supportServer: string = "https://discord.gg/HjXB4HW";

  constructor(token: string) {
    super({
      disableMentions: "everyone",
      ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] },
    });

    this.token = token;
  }

  async start() {
    expressListener();
    dbLogin();
    this.loader.loadCommands();
    this.loader.loadEvents();

    super.login(this.token as string);
  }
}
