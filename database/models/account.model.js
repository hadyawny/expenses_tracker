import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: [2, 'too short account name']
    },
    type: {
        type: String,
        enum: ['cash', 'bank', 'credit card', 'investment', 'savings', 'checking', 'loan', 'retirement', 'expense'],
        default: "cash",
      },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    currentBalance:{
        type:Number,
        default:0
    }


}, { timestamps: true })


export const accountModel = mongoose.model('account', schema)



