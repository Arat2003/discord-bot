import chalk from "chalk";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { footer } from "../botConstants.json";

// Footer: ╭ ╯

const availableEmojis = ["⏮️", "◀️", "⏹️", "▶️", "⏭️"];

class Pagination {
  message!: Message;
  channel: TextChannel;
  pages: MessageEmbed[];
  index = 0;
  time = 30000;

  constructor(
    channel: TextChannel,
    pages: Array<MessageEmbed>,
    footerText: string = "Page"
  ) {
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

    Promise.all([
      this.message.react(availableEmojis[1]),
      this.message.react(availableEmojis[2]),
      this.message.react(availableEmojis[3]),
    ]);

    const reactionCollector = this.message.createReactionCollector(
      (reaction, _user) => {
        return (
          availableEmojis.includes(reaction.emoji.name) &&
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
          if (user.id !== this.message.client.user!.id)
            reaction.users.remove(user);
        });
      }

      if (!availableEmojis.includes(reaction.emoji.name)) return;

      if (reaction.emoji.name === availableEmojis[1]) {
        // Back to previous page.
        this.index--;
        if (this.index < 0) this.index = this.pages.length - 1;
        this.message.edit(this.pages[this.index]);
        resetTimers();
      } else if (reaction.emoji.name === availableEmojis[2]) {
        // Stop listening to reactions
        reactionCollector.stop("stopped by user");
        this.message.reactions.removeAll();
        clearTimeout(timeoutHandle);
      } else if (reaction.emoji.name === availableEmojis[3]) {
        // Next page
        this.index++;
        if (this.index >= this.pages.length) {
          this.index = 0;
        }
        this.message.edit(this.pages[this.index]);
        resetTimers();
      }
    });
  }
}

export default Pagination;
