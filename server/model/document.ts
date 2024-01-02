import mongoose from 'mongoose'

export const ItemDocSchema = new mongoose.Schema({
  file_nama: { type: String, required: true },
  file_keterangan: { type: String, required: false },
  },{ timestamps: false})

export const ItemSchema = new mongoose.Schema({
  item_kode: { type: String, required: true },
  item_uraian: { type: String, required: true },
  item_catatan: { type: String, required: false },
  item_files: [{ type: ItemDocSchema, required: false }]
}, {
  timestamps: true
})

const schema = new mongoose.Schema({
  dok_number: { type: String, required: true },
  dok_date: { type: Date, required: true },
  dok_name: { type: String, required: true }, 
  dok_item: [{ type: ItemSchema, required: false, select: false, default: [] }]
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
// const Item = mongoose.model('Item')
// const ItemDoc = mongoose.model('ItemDoc')

export const getDocById = async (id: string) => Document.findById(id);
