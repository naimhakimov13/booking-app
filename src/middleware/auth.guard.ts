import { Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import config from 'config'

import { ExpressRequestInterface } from '../types/expressRequest.interface'
import User from '../models/User'
import { HttpStatus } from '../types/http-status.enum'

export const authGuard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {

  if (!req.headers.authorization) {
    req.user = null
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not authorized' })
  }

  const token = req.headers.authorization.split(' ')[1]
  try {
    const decode: any = verify(token, config.get('secret'))
    req.user = await User.findById(decode._id)
    next()
  } catch (err) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not authorized' })
  }
}
