import { Message } from "discord.js";
import path from "path";
import { promises as fs } from "fs";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";
import chalk from "chalk";

export default class Reload extends Command {
  devOnly = true;
  name = "reload";
  category: Categories = "Developer";
  description = "Reloads a command";
  usage = "<command>";

  async execute(
    message: Message,
    args: string[],
    _prefix: string
  ): Promise<Message | void> {
    if (!args.length)
      return message.channel.send("lmfao u forgetting something dude");

    const commandName = args[0].toLowerCase();
    const command =
      this.client.commands.get(commandName) ||
      this.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    const reloadCommand: (
      command: Command,
      dirPath?: string
    ) => Promise<Message | void> = async (
      command: Command,
      dirPath: string = path.join(__dirname, "..")
    ) => {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        let stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          reloadCommand(command, filePath);
        } else {
          const parsedPath = path.parse(filePath);

          if (parsedPath.ext === ".ts" || parsedPath.ext === ".js") {
            if (parsedPath.name == command.name) {
              try {
                delete require.cache[require.resolve(filePath)];
                this.client.commands.delete(command.name);
                const reloadedCmd = require(filePath);

                const cmd: Command = new reloadedCmd.default(this.client);

                this.client.commands.set(cmd.name, cmd);

                return message.channel.send("reloaded bbg");
              } catch (err) {
                console.log(
                  chalk.red.bold("[Reload Command] ") + chalk.red(`${err}`)
                );

                return message.channel.send("ah you fuct up bro");
              }
            }
          }
        }
      }

      return;
    };

    reloadCommand(command);
  }
}
