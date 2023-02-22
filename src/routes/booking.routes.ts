import { Response, NextFunction, Router } from 'express'
import Booking from '../models/Booking'
import { normalizeFilter, notFound } from '../utils/helpers'
import { check, validationResult } from 'express-validator'
import { HttpStatus } from '../types/http-status.enum'
import { authGuard } from '../middleware/auth.guard'
import { ExpressRequestInterface } from '../types/expressRequest.interface'
import { Query } from 'express-serve-static-core'
import { Router as RouterInterface } from 'express-serve-static-core'

const router: RouterInterface = Router({ mergeParams: true })

router.get('/', [
  authGuard,
  async ({ query, user }: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {

      const queryParams: Query = JSON.parse(JSON.stringify(query))
      const filters = normalizeFilter(queryParams)

      const bookingList = filters.length ? await Booking.find({
        $and: filters,
        ...query?.status && { status: +query.status },
         company_id: user.company_id
      }) : await Booking.find({ company_id: user.company_id })

      res.json(bookingList)
    } catch (err) {
      next(err)
    }
  }])

router.get('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id, company_id: req.user.company_id })

      if (!booking) {
        return notFound('booking', res)
      }

      res.json(booking)
    } catch (err) {
      next(err)
    }
  }])

const validations = [
  check('table_id', 'table_id is required').exists(),
  check('date', 'date is required').exists(),
  check('time_start', 'time_start is required').exists(),
  check('time_end', 'time_end is required').exists(),
  check('phone', 'phone is required').exists()
]

router.post('/', [
  ...validations,
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
      }

      const booking = new Booking({ ...req.body, user_id: req.user._id })

      const data = await booking.save()

      res.send(data)
    } catch (err) {
      next(err)
    }
  }]
)

router.put('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const booking = await Booking.findByIdAndUpdate(req.params.id, {
        ...req.body,
        user_id: req.user._id
      }, { new: true })

      if (!booking) {
        return notFound('booking', res)
      }

      res.json(booking)
    } catch (err) {
      next(err)
    }
  }])

router.delete('/:id', [
  authGuard,
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const booking = await Booking.findOneAndDelete({ _id: req.params.id, user_id: req.user._id })

      if (!booking) {
        return notFound('booking', res)
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
      const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user._id })

      if (!booking) {
        return notFound('booking', res)
      }

      await Booking.updateOne({ _id: req.params.id }, {
        status: booking.status === 1 ? 0 : 1
      })

      res.status(HttpStatus.NO_CONTENT).json()
    } catch (err) {
      next(err)
    }
  }])

export default router
