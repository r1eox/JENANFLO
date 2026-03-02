import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
