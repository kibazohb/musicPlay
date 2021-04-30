import mongoose, { Schema, Document } from "mongoose";
const bcrypt = require("bcrypt");

// export interface IUser extends Document {
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// }

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const newPassword = await bcrypt.hash(this.password, salt);
    this.password = newPassword;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.isValidPassword = async function(password) {
  try {
      return await bcrypt.compare(password, this.password)
  } catch (error) {
      throw error
  }
}

// Export the model and return your IUser interface
const User = mongoose.model("user", UserSchema);
module.exports = User;
