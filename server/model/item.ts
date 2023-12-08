import mongoose, { Schema } from 'mongoose'
import { ItemDoc } from './itemdoc'

const schema = new Schema({
  item_kode: { type: String, required: true },
  item_uraian: { type: String, required: true },
  item_catatan: { type: String, required: false },
  item_files: [{ type: ItemDoc, required: false }]
}, {
  timestamps: true
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})
schema.index({ item_kode: 1 }, { unique: true })

export const Item = mongoose.model('Item', schema)
