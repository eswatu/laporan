import express from 'express'
import Joi from 'joi'
import * as documentService from '../services/document.services'
import { validateRequest } from '../_middleware/validate-request'
import { processFileMiddleware as processFile } from '../_middleware/filetransfer';
import { format } from 'util'
import { Storage } from '@google-cloud/storage'
import ShortUniqueId from 'short-unique-id'

const router = express.Router();

function validateBody (req:express.Request, res: express.Response, next:express.NextFunction) {
  const schema = Joi.object({
    dok_number: Joi.string().required(),
    dok_date: Joi.date().required(),
    dok_name: Joi.string().required()
  });
  validateRequest(req, next, schema)
}

async function getAllDocs(req, res, next) {
  try {
    // console.log('i called get all docs');
    const docs = await documentService.getAllDocs(req.query);
    res.status(200).json(docs);
  } catch (error) {
    next(error);
  }
}
async function getDocById(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    if (typeof req.params.id === 'undefined') {
      throw new Error('ID is required')
    }
    const doc = await documentService.getDocById(req.params.id)
    res.status(200).json(doc)
  } catch (error) {
    next(error)
  }
}
async function createDoc (req, res, next) {
  // console.log('create called')
  console.log('body isinya ', req.body)
  try {
    const doc = await documentService.createDoc(req.body)
    res.status(200).json({doc})
  } catch (error) {
    next(error)
  }
}
function updateDocbyId(req, res, next) {
  try {
    if (typeof req.params.id === 'undefined') {
      throw new Error('ID is required')
    }
    documentService.updateDoc(req.params.id, req.body).then(r => res.json(r)).catch(next)
    } catch (error) {
    // console.error(error);
   next(error)
  }
}
// create item by pushing in array
function createItemForDoc(req: express.Request, res: express.Response, next:express.NextFunction) {
  try {
    // console.log('id isinya: ', req.params.id)
    // console.log('body isinya: ', req.body)
    if (req.params.id === undefined) {
      throw new Error('ID is required')
    }
    documentService.createItemForDoc(req.params.id, req.body).then(r => res.json(r)).catch(next)
  } catch (error) {
    // console.error(error);
    next(error)
  }
}
// update one item using item id by passing parameter from doc id
function updateItemInDoc(req: express.Request, res: express.Response, next:express.NextFunction) {
  try {
    if (req.params.id === undefined) {
      throw new Error('ID is required')
    }
    documentService.updateItemForDoc(req.params.id, req.body).then(r => res.json(r)).catch(next)
  } catch (error) {
    // console.error(error);
    next(error)
  }
}
// delete an item using id
function deleteItemById(req: express.Request, res: express.Response, next:express.NextFunction) {
  try {
    if (req.params.id === undefined) {
      throw new Error('ID is required')
    }
    documentService.deleteItemId(req.params.id).then(r => res.json(r)).catch(next)
  } catch (error) {
    // console.error(error);
    next(error)
  }
}
// CRUD file item

// File handling
// instantiate storage with credential
const storage = new Storage({keyFilename: 'gkey.json'})
const bucketName = "dok-laporan"
const bucket = storage.bucket(bucketName);

// uplload file pake nomor id dokumen dan id item
export async function uploadFile(req, res) {
  const bucket = storage.bucket(bucketName);
  try {
    // console.log(req)
    await processFile(req, res)
    // check if file exists
    if (!req.file) {
      return res.status(400).send({message:'File tidak ada '})
    }
    const uid = new ShortUniqueId({length: 10})
    const fname  = (await documentService.getDocById(req.params.docnum)).dok_number! as string + '-' + req.params.itemid + '-' + uid.rnd(8) + '-' + req.file.originalname.replace(/\s/g, '');
    // console.log(fname)
    // transfer fname ke data item
    const blob = bucket.file(fname)
    const blobStream = blob.createWriteStream({resumable:false})
    // watch event
    blobStream.on("error", (err) => {
      res.status(500).send({message: err.message})
    })
    blobStream.on("finish", async (data) => {
      // create url for direct access via http
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      // make file public
      try {
        // make file become public read using acl
        await storage.bucket(bucketName).file(blob.name).acl.add({
          entity: 'allUsers', role: storage.acl.READER_ROLE
        }).catch(console.error)
        // .makePublic().catch(console.error)
        // updte ke nama file yang tersimpan di database
        const newsssss = { fname: fname, fket: req.body.ket}
        await documentService.addFileItemForDoc( req.params.itemid, newsssss)
        // .catch(console.error)
        return res.status(200).send({message: "upload berhasil: "+ req.file.originalname, url: publicUrl})
      } catch {
        return res.status(500).send({message: `Uploaded file successfully: ${req.file.originalname}, but public access is denied`,
      url: publicUrl})
      }
    })
    blobStream.end(req.file.buffer)
  } catch (error) {
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 10MB!",
      })
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error}`,
    })
  }
}
function getStringAfterLastDot(input: string): string {
  const lastDotIndex = input.lastIndexOf('.');

  if (lastDotIndex !== -1 && lastDotIndex < input.length - 1) {
    // Found a dot and it's not the last character
    return input.substring(lastDotIndex + 1);
  } else {
    // No dot found or it's the last character
    return '';
  }
}
export async function downloadFile(req, res) {
  const cfile = bucket.file(req.params.name);
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata()
    console.log(metaData)
    const dfile = await cfile.download();
    // Set response headers for the file download
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.name}`);
    res.setHeader('Content-Type', metaData.contentType);

    // Send the file buffer to the client
    res.send(dfile[0]);
  } catch (err) {
    res.status(500).send({
      message: 'Could not download file ' + err
    })
  }
}
export async function getFileList(req,res) {
    // sementara
  documentService.getAllFileForItem(req.params.docnum, req.params.itemid).then(r => res.json(r)).catch(console.error)
}
// router doc
router.get('/', getAllDocs);
router.get('/:id', getDocById);
router.post('/', validateBody, createDoc);
router.put('/:id', validateBody, updateDocbyId);
// router item
router.post('/item/:id', createItemForDoc)
router.put('/item/:id', updateItemInDoc)
router.delete('/item/:id', deleteItemById)
// router file
// id ini berisi id dari item, nanti akan diambil nomor dokumen untuk nama bucket
router.post('/upload/:docnum/:itemid', uploadFile)
router.get('/download/:name', downloadFile)
router.get('/files/:docnum/:itemid', getFileList)
export default router;