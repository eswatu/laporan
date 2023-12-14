const util = require('util')
import Multer from "multer"

const maxSize = 10 * 1024 * 1024

export const processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize}
}).single('file')

export const processFileMiddleware = util.promisify(processFile);
