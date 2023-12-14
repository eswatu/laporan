import { Document as documents, ItemSchema as item } from '../model/document'


export async function getAllDocs () {
  const docs = await documents.find()
  if (!docs) {
    throw new Error('Dokumen tidak ditemukan')
  }
  return docs
}
// find document using id string, return document
export async function getDocById (id: string) {
  const document = await documents.findById(id)
  if (document === null) {
    throw new Error('Dokumen tidak ditemukan')
  }
  return document
}

// create document using data object
export async function createDoc (data) {
  try {
    const doc = new documents({
      dok_number: data.dok_number,
      dok_date: data.dok_date,
      dok_name: data.dok_name,
      dok_item: []
    });
    await doc.save();
    return doc
  } catch (error) {
    // console.error(error);
    return error
  }
}

// update document using data object
export async function updateDoc (id: string, data: any): Promise<any> {
  try {
    const doc = await documents.updateOne(
      { _id: id },
      {
        dok_number: data.dok_number,
        dok_date: data.dok_date,
        dok_name: data.dok_name,
        dok_item: data.dok_item
      }
    )
    if (doc.modifiedCount !== 0) { return doc }
  } catch (error) {
    // console.error(error);
    return error
  }
}

// Create dan Update untuk item
// create item
export async function createItemForDoc (id, item) {
  try {
    // save item to docs
    const doc = await documents.updateOne(
      { _id: id },
      {
        $push: { dok_item: item }
      }
    )
    if (doc.modifiedCount !== 0) { return doc }
  } catch (error) {
    // console.error(error);
    return error
  }
}
// update one item using item id by passing parameter from doc id
// di bagian client nanti jangan lupa konversi _id menjadi id
export async function updateItemForDoc(id, item) {
  try {
    // save item to docs
    const doc = await documents.updateOne(
      { "dok_item._id" : item.id },
      { $set: { "dok_item.$.item_kode": item.item_kode,
                "dok_item.$.item_uraian": item.item_uraian,
                "dok_item.$.item_catatan": item.item_catatan } }
    )
    console.log('i updated: ', doc)
    if (doc.modifiedCount !== 0) { return doc }
  } catch (error) {
    // console.error(error);
    return error
  }
}
// delete item using specified id
export async function deleteItemId (id) {
  try {
    const doc = await documents.updateOne(
      { },
      { $pull: {"dok_item" : { _id : id }}})
  } catch (error) {
    // console.error(error);
    return error
  }
}
