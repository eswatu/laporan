import { documents, isValid } from '../_helpers/db'
import { Document, Item } from '../model'
function checkValidity (id: string): void {
  if (!isValid(id)) throw new Error('invalid id')
}
// find document using id string
export async function getDocById (id: string): Promise<any> {
  checkValidity(id)
  const document = await documents.findById(id)
  if (document === null) {
    throw new Error('Dokumen tidak ditemukan')
  }
  return document
}
// create document using data object
export async function createDoc (data: any): Promise<any> {
  try {
    const doc = new Document({
      dok_number: data.dok_number,
      dok_date: data.dok_date,
      dok_name: data.dok_name,
      dok_item: []
    })
    return doc
  } catch (error) {
    // console.error(error);
    return { success: false, message: `error: ${String(error)}` }
  }
}
// update document using data object
export async function updateDoc (id: string, data: any): Promise<any> {
  checkValidity(id)
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
    if ((doc as any).nModified === 0) { return { success: false } }
    return { success: true }
  } catch (error) {
    // console.error(error);
    return { success: false, message: `error: ${String(error)}` }
  }
}

// CReate dan Update untuk item
// create item
export async function createItemForDoc (id: string, item: any): Promise<any> {
  checkValidity(id)
  try {
    // create new item
    const newItem = new Item({
      item_kode: item.item_kode,
      item_uraian: item.item_uraian,
      item_nama: item.item_nama,
      item_files: [{}]
    })
    // save item to docs
    const doc = await documents.updateOne(
      { _id: id },
      {
        $push: { dok_item: newItem }
      }
    )
    if ((doc as any).nModified === 0) { return { success: false } }
    return { success: true }
  } catch (error) {
    // console.error(error);
    return { success: false, message: `error: ${String(error)}` }
  }
}
// export async function updateItemForDoc (id: string, oItem: any, nItem: any): Promise<any> {
//   checkValidity(id)
//   try {
//     // create new item
//     const newItem = new Item({
//       item_kode: nItem.item_kode,
//       item_uraian: nItem.item_uraian,
//       item_nama: nItem.item_nama,
//       item_files: [{}]
//     })
//     // save item to docs
//     const doc = await documents.findById(id)
//     if (doc === null) return new Error('Dokumen tidak ditemukan')
//     let dcitem = doc.dok_item.find({ item_kode: oItem.item_kode })

//     if ((doc as any).nModified === 0) { return { success: false } }
//     return { success: true }
//   } catch (error) {
//     // console.error(error);
//     return { success: false, message: `error: ${String(error)}` }
//   }
// }
