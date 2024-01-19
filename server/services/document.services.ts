import { Document as documents, ItemSchema as item, ItemDocSchema as itemFile } from '../model/document'
import { Storage } from '@google-cloud/storage'
import { paginateDoc} from "../_middleware/paginate";

export async function getAllDocs (q) {
  return paginateDoc(documents, q)
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
    const doc = await documents.findOneAndUpdate(
      { _id: id },
      {
        dok_number: data.dok_number,
        dok_date: data.dok_date,
        dok_name: data.dok_name,
        dok_item: data.dok_item
      },{returnDocument: 'after'}
    )
    return doc;
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
    const doc = await documents.findOneAndUpdate(
      { _id: id },
      {
        $push: { dok_item: item }
      }, {returnDocument: 'after'}
    )
    return doc;
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
    const doc = await documents.findOneAndUpdate(
      { "dok_item._id" : item._id },
      { $set: { "dok_item.$.item_kode": item.item_kode,
                "dok_item.$.item_uraian": item.item_uraian,
                "dok_item.$.item_catatan": item.item_catatan } },
      {returnDocument: 'after'}
    )
    return doc;
  } catch (error) {
    // console.error(error);
    return error
  }
}
// delete item di dokumen
// di bagian client nanti jangan lupa konversi _id menjadi id
export async function deleteItemForDoc(id) {
  try {
    // save item to docs
    const doc = await documents.findOneAndDelete(
      { "dok_item._id" : id }
    )
    return doc;
  } catch (error) {
    // console.error(error);
    return error
  }
}
// add new file for item
export async function addFileItemForDoc(itemid, file) {
  console.log(file)
  const newFileItem = { file_nama : file.fname, file_keterangan: file.fket}
  try {
    // save item to docs
    const doc = await documents.updateOne(
      { "dok_item._id" : itemid },
      { $push: { "dok_item.$.item_files" : newFileItem } }
    )
    console.log('new item inserted to ', itemid)
    if (doc.modifiedCount !== 0) { return doc }
  } catch (error) {
    // console.error(error);
    return error
  }
}
// file for item id
// belum dites
export async function deleteFileItemForDoc(item, fname) {
  try {
    // save item to docs
    const doc = await documents.updateOne(
      { "dok_item._id" : item.id },
      { $pull: { "dok_item.item_files.file_name": fname } }
    )
    console.log('deleted ', fname)
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

// item files CRUD
// find all file for item id
// File handling
// instantiate storage with credential
const storage = new Storage({keyFilename: 'gkey.json'})
const bucketName = "dok-laporan"
export async function getAllFileForItem(docnum, itemid) {
    // sementara
    const bucket = storage.bucket(bucketName)
  try {
    const q = ((await getDocById(docnum)).dok_number!) + '-' + itemid;
    console.log('will search for ',q)
    const [files] = await bucket.getFiles({prefix:q})
    let fileInfos = []
    files.forEach((file) => {
      fileInfos.push({
        name: file.name, url: file.metadata.mediaLink
      })
    })
    return fileInfos
  } catch (err) {
    console.log(err)
    return { message: "unable to read list of files" }
  }
}
