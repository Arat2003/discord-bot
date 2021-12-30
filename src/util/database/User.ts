// import mongoose, { Schema } from "mongoose";
// import { dbUser } from "../interfaces/dbUser";

// const userSchema: Schema = new Schema({
//   userID: { type: String, required: true, unique: true },
//   minecraftUUID: { type: String, required: true },
//   isLinked: { type: Boolean, required: true },
// });

// const UserModel = mongoose.model<dbUser>("User", userSchema);

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "users" } })
class UserClass {
  @prop()
  public userID!: string;

  @prop()
  public minecraftUUID!: string;

  @prop()
  public isLinked!: boolean;
}

const UserModel = getModelForClass(UserClass);

export default UserModel;
