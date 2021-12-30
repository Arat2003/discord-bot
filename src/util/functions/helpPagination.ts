import chalk from "chalk";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import MinestatsClient from "../../structures/client/Client";
import { footer } from "../botConstants.json";

class HelpPagination {
  message!: Message;
  client: MinestatsClient;
  channel: TextChannel;
  pages: MessageEmbed[];
  index = 0;
  time = 30000;
  emojis: string[] = [];

  constructor(
    client: MinestatsClient,
    channel: TextChannel,
    pages: MessageEmbed[],
    footerText: string = "Page"
  ) {
    this.client = client;
    this.channel = channel;
    this.pages = pages.map((page, pageIndex) => {
      if (page.footer && (page.footer.text || page.footer.iconURL)) {
        return page.setFooter(
          `〘 ${footerText} ${pageIndex + 1} / ${pages.length} 〙 ${
            page.footer.text
          }`
        );
      }
      return page.setFooter(
        `〘 ${footerText} ${pageIndex + 1} / ${pages.length} 〙 ${footer}`
      );
    });
  }

  async paginate(time: number) {
    this.message = await this.channel.send(this.pages[this.index]);
    if (this.pages.length < 2) return;
    let minecraft = this.client.getEmoji("minecraft", "support");
    let hypixel = this.client.getEmoji("hypixel", "support");
    let misc = this.client.getEmoji("miscellaneous", "support");

    this.emojis = ["⚒️", hypixel!.id, minecraft!.id, misc!.id];
    for (const emoji of this.emojis) {
      await this.message.react(emoji);
    }

    const reactionCollector = this.message.createReactionCollector(
      (reaction, _user) => {
        return (
          (this.emojis.includes(reaction.emoji.name) ||
            this.emojis.includes(reaction.emoji.id)) &&
          !(reaction.me && reaction.users.cache.size === 1)
        );
      },
      { time: time || this.time, max: this.pages.length * 5 }
    );

    let timeoutHandle = setTimeout(() => {
      if (
        this.message.guild &&
        this.message.guild.me?.hasPermission("MANAGE_MESSAGES")
      ) {
        this.message.reactions
          .removeAll()
          .catch((err) =>
            console.log(chalk.red.bold("[Pagination] ") + chalk.red(err))
          );
      }
    }, reactionCollector.options.time);

    const resetTimers = () => {
      reactionCollector.resetTimer({ time: time || this.time });
      clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(() => {
        if (
          this.message.guild &&
          this.message.guild.me?.hasPermission("MANAGE_MESSAGES")
        ) {
          this.message.reactions
            .removeAll()
            .catch((err) =>
              console.log(chalk.red.bold("[Pagination] ") + chalk.red(err))
            );
        }
      }, reactionCollector.options.time);
    };

    reactionCollector.on("collect", async (reaction) => {
      if (
        this.message.guild &&
        this.message.guild.me?.hasPermission("MANAGE_MESSAGES")
      ) {
        (await reaction.users.fetch()).forEach((user) => {
          if (user.id !== this.client.user!.id) reaction.users.remove(user);
        });
      }

      if (reaction.emoji.name === this.emojis[0]) {
        // Admin
        if (this.index !== 0) {
          this.index = 0;
          this.message.edit(this.pages[this.index]);
          resetTimers();
        }
      }

      if (reaction.emoji.id === this.emojis[1]) {
        // Hypixel
        if (this.index !== 1) {
          this.index = 1;
          this.message.edit(this.pages[this.index]);
          resetTimers();
        }
      }

      if (reaction.emoji.id === this.emojis[2]) {
        // Minecraft
        if (this.index !== 2) {
          this.index = 2;
          this.message.edit(this.pages[this.index]);
          resetTimers();
        }
      }

      if (reaction.emoji.id === this.emojis[3]) {
        // Misc
        if (this.index !== 3) {
          this.index = 3;
          this.message.edit(this.pages[this.index]);
          resetTimers();
        }
      }
    });
  }
}

export default HelpPagination;
