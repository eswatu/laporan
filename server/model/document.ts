import mongoose, { Schema } from 'mongoose'

const ItemDocSchema = new Schema({
  file_nama: { type: String, required: true },
  file_keterangan: { type: String, required: false },
  file_data: { type: String, required: false }
}, {
  timestamps: true
})

const ItemSchema = new Schema({
  item_kode: { type: String, required: true },
  item_uraian: { type: String, required: true },
  item_catatan: { type: String, required: false },
  item_files: [{ type: ItemDocSchema, required: false }]
}, {
  timestamps: true
})

const schema = new Schema({
  dok_number: { type: String, required: true },
  dok_date: { type: Date, required: true },
  dok_name: { type: String, required: true },
  dok_item: [{ type: ItemSchema, required: false, default: [] }]
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
export const Item = mongoose.model('Item', ItemSchema)
export const ItemDoc = mongoose.model('ItemDoc', ItemDocSchema)
