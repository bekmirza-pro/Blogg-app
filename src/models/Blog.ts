import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IBlog extends Document {
    _id: string
    creator: string
    category: string
    title: string
    content: string
    images: string[]
    madeAt: number
}

const BlogSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    creator: {
        type: String,
        ref: 'Admin'
    },
    category: {
        type: String,
        ref: 'Category'
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    images: [
        {
            type: String
        }
    ],
    madeAt: {
        type: Number,
        default: Date.now
    }
})

export default mongoose.model<IBlog>('Blog', BlogSchema)
