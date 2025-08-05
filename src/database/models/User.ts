import { model, Schema } from "mongoose";

const User = new Schema(
  {
    telegramId: { type: Number, required: true, unique: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    dateOfSubscription: {
      type: Date,
      default: null,
    },
    usedPromocodes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Promocode",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

export default model("User", User);
