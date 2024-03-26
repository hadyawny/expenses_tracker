import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    total: Number,
    account: {
      type: mongoose.Types.ObjectId,
      ref: "account",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const balanceModel = mongoose.model("balance", schema);
