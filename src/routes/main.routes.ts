import express, { Response, NextFunction } from 'express'

import Booking from '../models/Booking'
import Table from '../models/Table'
import { ExpressRequestInterface } from '../types/expressRequest.interface'
import { authGuard } from '../middleware/auth.guard'
import { Query } from 'express-serve-static-core'
import { clean } from '../utils/helpers'

const router = express.Router()

router.get('/', [
  authGuard,
  async ({query, user}: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const queryParams: Query = query
      const tables = await Table.find({
        company_id: user.company_id,
        ...query.seat_count && typeof +query.seat_count === 'number' && { seat_count: +query.seat_count }
      })

      const filters = Object.keys(clean(queryParams)).map((key) => ({
        [key]: new RegExp(queryParams[key] as string, 'i')
      }))

      const list = JSON.parse(JSON.stringify(tables)).map(async (table: any) => {
        const bookings = await Booking.find({
          ...filters.length && { $and: filters },
          table_id: table._id,
          ...query.date && { date: query.date }
        })
        return {
          ...table,
          bookings
        }
      })

      const result = await Promise.all(list)

      res.send(result)
    } catch (err) {
      next(err)
    }
  }]
)

export default router
