import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: [2, 'too short budget name']
    },
    amount: {
        type: Number,
        required: true
    },
    period: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly', 'one time'],
        required: true
    },
    accounts: [{
        type: mongoose.Types.ObjectId,
        ref: "account"
    }],

    amountSpent: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        
    },
    endDate: {
        type: Date,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

export const budgetModel = mongoose.model('budget', schema);
