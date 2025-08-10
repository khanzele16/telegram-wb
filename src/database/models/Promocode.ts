import { model, Schema } from "mongoose";

const Promocode = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    useNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("Promocode", Promocode);
