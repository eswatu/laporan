import { type NextFunction, type Request, type Response } from 'express'

enum ErrorNames {
  CustomError = 'CustomError',
  ValidationError = 'ValidationError',
  UnauthorizedError = 'UnauthorizedError',
}

export function errorHandler (err: any, req: Request, res: Response, _next: NextFunction): Response {
  let statusCode // declare variable outside statement
  switch (true) {
    case typeof err === 'string':
      // custom application error
      // eslint-disable-next-line no-case-declarations
      const is404 = err.toLowerCase().endsWith('not found')
      statusCode = is404 ? 404 : 400
      return res.status(statusCode).json({ message: err })

    case err.name === ErrorNames.ValidationError:
      // mongoose validation error
      return res.status(400).json({ message: err.message })

    case err.name === ErrorNames.UnauthorizedError:
      // jwt authentication error
      return res.status(401).json({ message: 'Unauthorized' })

    default:
      // other errors
      return res.status(500).json({ message: err.message })
  }
}
