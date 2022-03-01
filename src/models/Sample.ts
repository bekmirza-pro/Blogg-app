import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ISample extends Document {
    _id: string
    name: string
    description: string
}

const sampleSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String
    },
    description: {
        type: String
    }
})

export default mongoose.model<ISample>('Sample', sampleSchema)
