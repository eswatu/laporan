import express from 'express'
import Joi from 'joi'
import * as documentService from '../services/document.services'
import { validateRequest } from '../_middleware/validate-request'
import { processFile } from '../_middleware/filetransfer';
import { format } from 'util'
import { Storage } from '@google-cloud/storage'
// instantiate storage with credential
const storage = new Storage({keyFilename: 'credentials.json'})
const bucket = storage.bucket('dok-laporan')

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
    console.log('i called get all docs');
    const docs = await documentService.getAllDocs();
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
  console.log('create called')
  console.log('body isinya ', req.body)
  try {
    const doc = await documentService.createDoc(req.body)
    res.status(200).json({doc})
  } catch (error) {
    next(error)
  }
}
function updateDocbyId(req: express.Request, res: express.Response, next:express.NextFunction) {
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
    console.log('id isinya: ', req.params.id)
    console.log('body isinya: ', req.body)
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

// File handling

export async function uploadFile(req, res, next) {
  try {
    await processFile(req, res)
    if (!req['file']) {
      return res.status(400).send({message:'File not found'})
    }
    // create blob di bucket, lalu upload
    const blob = bucket.file(req.file.originalname)
    const blobStream = blob.createWriteStream({resumable:false})
    blobStream.on("error", (err) => {
      res.status(500).send({message: err.message})
    })
    blobStream.on("finish", async (data) => {
      // create url for direct access via http
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      try {
        await bucket.file(req.file.originalname).makePublic()
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
export async function downloadFile(req, res, next) {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata()
    res.redirect(metaData.mediaLink)
  } catch (err) {
    res.status(500).send({
      message: 'Could not download file ' + err
    })
  }
}
export async function getFileList(req,res,next) {
  try {
    const [files] = await bucket.getFiles()
    let fileInfos = []
    files.forEach((file) => {
      fileInfos.push({
        name: file.name, url: file.metadata.mediaLink
      })
    })
    res.status(200).send(fileInfos)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: "unable to read list of files"
    })
  }
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
export default router;