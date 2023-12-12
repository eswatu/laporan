import express, { Router } from 'express'
import Joi, { type ObjectSchema } from 'joi'
import { validateRequest } from '../_middleware/validate-request'
import * as documentService from '../services/document.services'

const router = express.Router()

function checkNullBody(req: express.Request) {
  if (req.body === null) throw new Error('bad Request')
}

function createSchema (req: express.Request, next: express.NextFunction) {
  const schema: ObjectSchema = Joi.object({
    dok_number: Joi.string().required(),
    dok_date: Joi.date().required(),
    dok_name: Joi.string().required()
  })
  validateRequest(req, next, schema)
}

function updateSchema (req: express.Request, next: express.NextFunction) {
  const schema: ObjectSchema = Joi.object({
    dok_number: Joi.string().required(),
    dok_date: Joi.date().required(),
    dok_name: Joi.string().required()
  })
  validateRequest(req, next, schema)
}
function getAllDocs(req, res, next) {
  console.log('i called ')
  documentService.getAllDocs().then(al => res.json(al)).catch(next)
}
function getDocById(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    if (typeof req.params.id === 'undefined') {
      throw new Error('ID is required')
    }
    documentService.getDocById(req.params.id).then(r => res.json(r)).catch(next)
  } catch (error) {
    next(error)
  }
}
function createDoc (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    checkNullBody(req)
    documentService.createDoc(req.body).then(r => res.json(r)).catch(next)
  } catch (error) {
    next(error)
  }
}
function updateDocbyId(req: express.Request, res: express.Response, next:express.NextFunction) {
  checkNullBody(req)
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

router.get('/', getAllDocs)
router.get('/:id', getDocById)
router.post('/', createSchema, createDoc)
router.put('/:id', updateSchema, updateDocbyId)

module.exports = router