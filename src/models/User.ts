import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
    _id: string
    name: {
        first_name: string
        last_name: string
    }
    phone_number: number
    password: string
    type: string
    interested_categories: string
    photo: string
}

const UserSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        first_name: { type: String },
        last_name: { type: String }
    },
    phone_number: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    type: {
        type: String,
        default: 'user'
    },
    interested_categories: {
        type: String,
        ref: 'Category'
    },
    photo: {
        type: String
    }
})

export default mongoose.model<IUser>('User', UserSchema)
