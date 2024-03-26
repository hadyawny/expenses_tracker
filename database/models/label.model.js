import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: [2, 'too short label name']
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    color: {
        type: String,
        enum: ["red", "green", "blue", "yellow", "orange", "purple", "pink"],
        default: "blue"
      }


}, { timestamps: true })


export const labelModel = mongoose.model('label', schema)



