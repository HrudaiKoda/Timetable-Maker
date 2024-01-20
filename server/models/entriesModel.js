import mongoose from "mongoose";
const entrySchema = mongoose.Schema(
    {
        code:{
            type:String,
            required: true,
        },
        name:{
            type:String,
            required: true,
        },
        slot:{
            type:String,
            required: true,
        },
        isUsed: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);
export const Entry = mongoose.model('Entry', entrySchema);