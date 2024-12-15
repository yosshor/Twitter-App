import mongoose, { Schema } from "mongoose";


const followingSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
  
    followingList: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});


export const Following = mongoose.model('Following', followingSchema);