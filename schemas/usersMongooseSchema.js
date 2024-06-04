import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    verificated: {
      type: Boolean,
      default: false,
    },
    verificationKey: {
      type: String,
      required: [true, "Verify token is required"],
    },
    avatarURL: String,
  },
  { versionKey: false }
);

export default mongoose.model("user", UsersSchema);
