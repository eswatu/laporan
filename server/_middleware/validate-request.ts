export function validateRequest (req: any, next: any, schema: any): any {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  }
  const { error, value } = schema.validate(req.body, options)
  if (error !== null && error !== undefined) {
    next(`Validation error: ${error.details.map((x: any) => x.message).join(', ')}`)
  } else {
    req.body = value
    next()
  }
}
