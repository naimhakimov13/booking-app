import { Response } from 'express'
import { sign } from 'jsonwebtoken'
import config from 'config'

import { UserDocument } from '../types/user.interface'


export const buildUser = (user: UserDocument) => {
  const userClone = JSON.parse(JSON.stringify((user)))
  delete userClone.password
  return {
    user: {
      ...userClone
    },
    token: sign(userClone, config.get('secret'))
  }
}

export const notFound = (key: string, res: Response) => {
  return res.status(404).json({
    message: `${key} not found`
  })
}

export const clean = (obj: any) => {
  for (let propName in obj) {
    if (obj[propName] === '' || obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}

export const normalizeFilter = (obj: any) => {
  delete obj.status
  return Object.keys(clean(obj)).map((key) => ({
    [key]: typeof +obj[key] === 'number' && !isNaN(+obj[key]) ? +obj[key] : new RegExp(obj[key] as string, 'i')
  }))
}
