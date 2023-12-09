import { type NextFunction, Router as router, response } from 'express'
import { Joi, type ObjectSchema } from 'joi'
import { validateRequest } from '../_middleware/validate-request'
import * as documentService from '../services/document.services'

function createSchema (req: Request, res: Response, next: NextFunction): void {
  const schema: ObjectSchema = Joi.object({
    dok_number: Joi.string().required(),
    dok_date: Joi.date().required(),
    dok_name: Joi.string().required()
  })
  validateRequest(req, next, schema)
}

function updateSchema (req: Request, res: Response, next: NextFunction): void {
  const schema: ObjectSchema = Joi.object({
    dok_number: Joi.string().required(),
    dok_date: Joi.date().required(),
    dok_name: Joi.string().required()
  })
  validateRequest(req, next, schema)
}

async function createDoc (req: Request, res: Response, next: NextFunction):void {
  try {
    if (req.body === null) res.status(400).json({ message: 'bad Request' })
        await documentService.createDoc(req.body)
        if (response.success) {
        res.status(201).json({
        success: true, message: response.statusMessage, result: response.result
      })
    }
    res.status(500).json({ success: false, message: response.message })
  } catch (error) {
    next(error)
  }
}
