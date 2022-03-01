import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IAdmin extends Document {
    _id: string
    name: {
        first_name: string
        last_name: string
    }
    phone_number: number
    password: string
    type: string
    photo: string
}

const AdminSchema = new Schema({
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
    photo: {
        type: String
    },
    type: {
        type: String,
        enum: ['admin', 'super_admin'],
        default: 'admin'
    }
})

export default mongoose.model<IAdmin>('Admin', AdminSchema)
