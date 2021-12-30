import chalk from "chalk";
import moment from "moment";
import Event from "../../structures/client/Event";

class Ready extends Event {
  name = "ready";

  async run(): Promise<void> {
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        chalk.green.bold.underline(`${this.client.user!.username}`) +
        chalk.magenta(" shard ") +
        chalk.magenta.bold.underline(`#0`) +
        chalk.magenta(` started at ${moment()} `) +
        chalk.yellow("in ") +
        chalk.yellow.bold(`${process.uptime().toFixed(2)}`) +
        chalk.yellow("s; ") +
        chalk.red("currently on ") +
        chalk.red.bold(`${this.client.guilds.cache.size}`) +
        chalk.red(" servers. ") +
        chalk.blue("Using ") +
        chalk.blue.bold(
          `${(
            Object.values(process.memoryUsage()).reduce((x, y) => x + y) /
            Math.pow(1024, 2)
          ).toFixed(2)}`
        ) +
        chalk.blue(" MB.\n") +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    this.client.user?.setActivity("h!help", {
      type: "LISTENING",
      // url: "https://www.twitch.tv/skrratman",
    });
  }
}

export default Ready;
