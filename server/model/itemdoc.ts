import mongoose, { Schema } from 'mongoose'
// define property
const schema = new Schema({
  file_nama: { type: String, required: true },
  file_keterangan: { type: String, required: false },
  file_data: { type: String, required: false }
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

schema.index({ file_nama: 1 }, { unique: true })

export const ItemDoc = mongoose.model('ItemDoc', schema)
