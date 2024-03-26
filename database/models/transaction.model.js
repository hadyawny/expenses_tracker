import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    note: {
      type: String,
      trim: true,
      minLength: [2, "too short note"],
      maxLength: [300, "too long note"],
    },
    amount: Number,

    location: {
      type: String,
      trim: true,
      minLength: [2, "too short location"],
      maxLength: [100, "too long location"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
    },
    category: {
      type: String,
      enum: [
        "Food and Drinks",
        "Groceries",
        "Utilities",
        "Rent/Mortgage",
        "Transportation",
        "Healthcare",
        "Insurance",
        "Education",
        "Entertainment",
        "Dining Out",
        "Shopping",
        "Travel",
        "Savings",
        "Investments",
        "Gifts/Donations",
        "Personal Care",
        "Home Improvement",
        "Taxes",
        "Fees/Charges",
        "Income",
        "Other",
      ],
    },
    date: {
      type: Date,
      default: Date.now(),
    },

    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },

    label: {
      type: mongoose.Types.ObjectId,
      ref: "label",
    },
    account: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "account",
    },
  },
  { timestamps: true }
);

export const transactionModel = mongoose.model("transaction", schema);
