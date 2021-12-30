// import mongoose, { Schema } from "mongoose";
// import { dbGuild } from "../interfaces/dbGuild";

// const guildSchema: Schema = new Schema({
//   guildID: { type: String, required: true, unique: true },
//   prefix: { type: String, required: true },
//   language: { type: String, required: true },
//   guildOwnerID: { type: String, required: true },
//   prefixChangeAllowedRoles: Array,
//   ignoredChannels: Array,
// });

// const GuildModel = mongoose.model<dbGuild>("Guild", guildSchema);

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "guilds" } })
class GuildClass {
  @prop({ required: true })
  public guildID!: string;

  @prop({ required: true })
  public prefix!: string;

  @prop({ required: true })
  public language!: string;

  @prop({ required: true })
  public guildOwnerID!: string;

  @prop({ type: () => [String] })
  public prefixChangeAllowedRoles?: string[];

  @prop({ type: () => [String] })
  public ignoredChannels?: string[];
}

const GuildModel = getModelForClass(GuildClass);

export default GuildModel;
