import express, { Response, NextFunction } from 'express'
import { Types } from 'mongoose'

import UserModel from '../models/User'
import { notFound } from '../utils/helpers'
import { ExpressRequestInterface } from '../types/expressRequest.interface'
import { authGuard } from '../middleware/auth.guard'

const router = express.Router({ mergeParams: true })

router.get('/', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const allUsers = await UserModel.find({ company_id: req.user.company_id })
      res.json(allUsers)
    } catch (err) {
      next(err)
    }
  }])

router.get('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const user = Types.ObjectId.isValid(id) && await UserModel.findOne({ _id: id, company_id: req.user.company_id })

      if (!user) {
        return notFound('user', res)
      }
      res.json(user)
    } catch (err) {
      next(err)
    }
  }])

router.post('/toggle/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findOne({ _id: req.params.id, company_id: req.user.company_id })

      if (!user) {
        return notFound('user', res)
      }

      const userUpdate = await UserModel.updateOne({ _id: req.params.id }, {
        status: user.status === 1 ? 0 : 1
      }, { new: true })

      res.json(userUpdate)
    } catch (err) {
      next(err)
    }
  }])

router.put('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findOneAndUpdate({
        _id: req.params.id,
        company_id: req.user.company_id
      }, req.body, { new: true })

      if (!user) {
        return notFound('user', res)
      }

      res.json(user)
    } catch (err) {
      next(err)
    }

  }])

router.delete('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOneAndDelete({ _id: req.params.id, company_id: req.user.company_id })

    if (!user) {
      return notFound('user', res)
    }

    res.json({ message: 'Successfully removed' })
  } catch (err) {
    next(err)
  }
}])

export default router
