import mongoose from 'mongoose'
import * as config from '../config.json'
import { Document, Item, ItemDoc } from '../model'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
mongoose.connect(config.connectionString)
mongoose.Promise = global.Promise

function isValid (id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

module.exports = {
  Document,
  Item,
  ItemDoc,
  isValid
}
