import express, { Response, Request, NextFunction } from 'express'
import multer, { FileFilterCallback } from 'multer'
import fs from 'fs/promises'
import { join } from 'path'

import { authGuard } from '../middleware/auth.guard'

const router = express.Router({ mergeParams: true })

const upload = multer({
  limits: {
    fileSize: 5e+6
  },
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb( new Error('Please upload a valid image file'))
    }
    cb(undefined, true)
  },
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
      const extension = file.mimetype.split('/')[1];
      const fileName = (new Date().getTime() / 1000 | 0) + '.' + extension;
      callback(null, fileName);
    }
  })
})


router.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ name: req.file?.path })
  } catch (err) {
    next(err)
  }
})

router.post('/remove', [
  authGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fs.unlink(join(__dirname, '../..', req.body.name))
      res.send('Successfully removed')
    } catch (err) {
      next(err)
    }
  }])

export default router
