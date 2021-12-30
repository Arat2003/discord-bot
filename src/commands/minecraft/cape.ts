import { Message, MessageAttachment } from "discord.js";
import Command from "../../structures/client/Command";
import { getUserOrUUID } from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import fetch from "node-fetch";
import Canvas from "canvas";
import skinImage from "../../util/wrappers/skinImage";
import { ErrorResponses } from "../../util/interfaces/responses";
import { setPixelated } from "../../util/functions/canvas";

class Cape extends Command {
  name = "cape";
  description =
    "Show someone's cape. **Will prioritize Mojang capes over Optifine.**";
  category: Categories = "Minecraft";
  usage = "<username>";

  async execute(message: Message, args: string[], prefix: string) {
    message.channel.startTyping();
    if (!args.length) {
      message.channel.stopTyping();
      return message.channel.send(
        this.client.usageEmbed(`${prefix}${this.name} ${this.usage}`)
      );
    }

    let user = await getUserOrUUID(args[0]);
    if (user) {
      const mojangCape = `https://crafatar.com/capes/${user.uuid}`;
      const optifineCape = `http://s.optifine.net/capes/${user.name}.png`;

      const mojang = await fetch(mojangCape);
      let capeImg =
        mojang.headers.get("content-type") === "image/png"
          ? mojangCape
          : optifineCape;
      const cape =
        (await fetch(capeImg)).headers.get("content-type") === "image/png"
          ? capeImg
          : null;

      let capeText = capeImg.includes("crafatar") ? "Minecon" : "Optifine";

      if (cape) {
        const canvas = Canvas.createCanvas(636, 1024);
        const ctx = canvas.getContext("2d");
        setPixelated(ctx);
        const img = await Canvas.loadImage(cape);
        let height = 32;
        let width = 20;
        let start = 2;

        if (img.width === 46) {
          height = 16;
          width = 10;
          start = 1;
        } else if (img.width === 64) {
          height = 17;
          width = 5;
          start = 0.7;
        } else if (img.width === 184) {
          height = 64;
          width = 40;
          start = 4;
        }

        let hRatio = canvas.width / width;
        let vRatio = canvas.height / height;
        let ratio = Math.min(hRatio, vRatio);

        ctx.drawImage(
          img,
          start,
          start,
          img.width,
          img.height,
          0,
          0,
          img.width * ratio,
          img.height * ratio
        );

        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          "image.png"
        );

        const skinUrl = skinImage(user.uuid, "face");
        message.channel.stopTyping();
        return message.channel.send(
          this.client
            .templateEmbed()
            .setTitle(`${user.name}'s ${capeText} Cape`)
            .attachFiles([
              attachment,
              { name: "skin.png", attachment: skinUrl },
            ])
            .setImage("attachment://image.png")
            .setThumbnail("attachment://skin.png")
        );
      } else {
        message.channel.stopTyping();
        return message.channel.send(
          this.client
            .templateEmbed()
            .setDescription(`${user.name} doesn't have any capes :cry:`)
        );
      }
    } else {
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );
    }
  }
}

export default Cape;
