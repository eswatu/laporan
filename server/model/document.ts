import mongoose, { Schema } from 'mongoose'
import { Item } from './item'

const schema = new Schema({
  dok_number: { type: String, required: true },
  dok_date: { type: Date, required: true },
  dok_name: { type: String, required: true },
  dok_item: [{ type: Item, required: false }]
}, { timestamps: true })

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})
schema.index({ dok_number: 1 }, { unique: true })

export const Document = mongoose.model('Document', schema)
