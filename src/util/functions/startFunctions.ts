import express from "express";
import mongoose from "mongoose";
import chalk from "chalk";

export function dbLogin() {
  mongoose.connect(
    process.env.DB_URI as string, {},
    (err) => {
      if (err) {
        return console.log(chalk.red.bold("[DB LOGIN]") + chalk.red(`${err}`));
      }

      console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
          chalk.blue.bold("Connected to the database successfully.\n") +
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      );
    }
  );
}

export function expressListener() {
  const app = express();
  const port: number = 3000;

  app.all("/", (_, res) => res.send("Bot is up and running."));

  app.listen(port, () =>
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        chalk.blue.bold(`Example app listening at http://localhost:${port}\n`) +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    )
  );
}
