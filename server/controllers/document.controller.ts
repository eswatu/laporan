import express from 'express'
import Joi from 'joi'
import * as documentService from '../services/document.services'
import { validateRequest } from '../_middleware/validate-request'

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