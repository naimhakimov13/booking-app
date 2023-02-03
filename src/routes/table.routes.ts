import express, { Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator'

import Table from '../models/Table'
import { HttpStatus } from '../types/http-status.enum'
import { clean, notFound } from '../utils/helpers'
import { ExpressRequestInterface } from '../types/expressRequest.interface'
import { authGuard } from '../middleware/auth.guard'
import { Query } from 'express-serve-static-core'

const router = express.Router({ mergeParams: true })

router.get('/', [
  authGuard,
  async ({ query, user }: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const queryParams: Query = query

      const filters = Object.keys(clean(query)).map((key) => ({
        [key]: new RegExp(queryParams[key] as string, 'i')
      }))

      const findAll = Object.keys(queryParams).length ? await Table.find({
        $and: filters,
        company_id: user.company_id
      }) : await Table.find({ company_id: user.company_id })

      res.json(findAll)
    } catch (err) {
      next(err)
    }
  }])

router.get('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const table = await Table.findOne({ _id: req.params.id, company_id: req.user.company_id })

      if (!table) {
        return notFound('table', res)
      }

      res.json(table)
    } catch (err) {
      next(err)
    }
  }])


const validation = [
  check('name').exists().withMessage('name is required').isString().withMessage('name type is string'),
  check('seat_count').exists().withMessage('seat_count is required').isNumeric().withMessage('seat_count type is number'),
  check('type').exists().withMessage('type is required').isString().withMessage('type type is string'),
  check('company_id', 'company_id is required').exists()
]

router.post('/', [
  ...validation,
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(HttpStatus.BAD_REQUEST).json(errors.array())
      }

      const table = new Table({ ...req.body, company_id: req.user.company_id })

      const tableSave = await table.save()

      res.send(tableSave)
    } catch (err) {
      next(err)
    }
  }
])

router.put('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const table = await Table.findOneAndUpdate({
        _id: req.params.id,
        company_id: req.user.company_id
      }, req.body, { new: true })

      res.send(table)
    } catch (err) {
      next(err)
    }
  }])

router.delete('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const table = await Table.findOneAndDelete({ _id: req.params.id, company_id: req.user.company_id })

      if (!table) {
        return notFound('table', res)
      }

      res.status(HttpStatus.NO_CONTENT).json({ message: 'Successfully removed' })
    } catch (err) {
      next(err)
    }
  }])

router.post('/toggle/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const table = await Table.findOne({ _id: req.params.id, company_id: req.user.company_id })

      if (!table) {
        return notFound('table', res)
      }

      await Table.updateOne({ _id: req.params.id }, {
        status: table.status === 1 ? 0 : 1
      })

      res.status(HttpStatus.NO_CONTENT).json()

    } catch (err) {
      next(err)
    }
  }])

export default router
