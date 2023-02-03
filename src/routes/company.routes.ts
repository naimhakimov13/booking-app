import express, { Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator'

import Company from '../models/Company'
import { clean, notFound } from '../utils/helpers'
import { HttpStatus } from '../types/http-status.enum'
import { authGuard } from '../middleware/auth.guard'
import { Query } from 'express-serve-static-core'
import { ExpressRequestInterface } from '../types/expressRequest.interface'

const router = express.Router({ mergeParams: true })

router.get('/', [
  authGuard,
  async ({ query, user }: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const queryParams: Query = query

      const filters = Object.keys(clean(query)).map((key) => ({
        [key]: new RegExp(queryParams[key] as string, 'i')
      }))


      const findAll = Object.keys(queryParams).length ? await Company.find({
        $and: filters,
        company_id: user.company_id
      }) : await Company.find({ company_id: user.company_id })

      res.json(findAll)
    } catch (err) {
      next(err)
    }
  }])

router.get('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const user = await Company.findOne({ _id: req.params.id, company_id: req.user.company_id })

      if (!user) {
        return notFound('company', res)
      }
      res.json(user)
    } catch (err) {
      next(err)
    }
  }])

const validation = [
  check('name', 'name is required').exists(),
  check('description', 'description is required').exists(),
  check('address', 'address is required').exists(),
  check('phone', 'phone is required').exists()
]

router.post('/', [
  ...validation,
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
      }
      const company = new Company({ ...req.body, company_id: req.user.company_id })
      const saveCompany = await company.save()

      res.status(201).json(saveCompany)
    } catch (err) {
      next(err)
    }
  }])

router.post('/toggle/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const company = await Company.findOne({ _id: req.params.id, company_id: req.user.company_id })

      if (!company) {
        return notFound('company', res)
      }

      await Company.updateOne({ _id: req.params.id }, {
        status: company.status === 1 ? 0 : 1
      })

      res.status(HttpStatus.NO_CONTENT).json()
    } catch (err) {
      next(err)
    }
  }])

router.put('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const company = await Company.findOneAndUpdate({
        _id: req.params.id,
        company_id: req.user.company_id
      }, req.body, { new: true })

      if (!company) {
        return notFound('company', res)
      }

      res.json(company)
    } catch (err) {
      next(err)
    }
  }])

router.delete('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const company = await Company.findOneAndDelete({ _id: req.params.id, company_id: req.user.company_id })
      if (!company) {
        return notFound('company', res)
      }
      res.status(HttpStatus.NO_CONTENT).json({ message: 'Successfully removed' })
    } catch (err) {
      next(err)
    }
  }])

export default router
