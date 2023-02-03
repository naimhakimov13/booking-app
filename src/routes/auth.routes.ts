import express, { Response, Request, NextFunction } from 'express'

import UserModel from '../models/User'
import { buildUser } from '../utils/helpers'
import { UserDocument } from '../types/user.interface'
import { check, validationResult } from 'express-validator'
import { HttpStatus } from '../types/http-status.enum'

const router = express.Router({ mergeParams: true })

const validationsSignIn = [
  check('email').exists().withMessage('email number is required').isEmail().withMessage('email is incorrect'),
  check('password').exists().withMessage('password number is required').isLength({ min: 6 }).withMessage('minimum length 6')
]

const validationsSignup = [
  ...validationsSignIn,
  check('phone', 'phone number is required').exists(),
  check('company_id', 'company_id is required').exists()
]

router.post('/signup', [
  ...validationsSignup,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
      }
      const sameEmail = await UserModel.findOne({ email: req.body.email })

      if (sameEmail) {
        return res.status(400).json({
          message: 'Email already exist'
        })
      }

      const user = new UserModel({
        ...req.body
      })

      const saveUser = await user.save()

      res.status(201).json(buildUser(saveUser))
    } catch (err) {
      next(err)
    }
  }])

router.post('/signin',
  [
    ...validationsSignIn,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json(errors.array())
        }

        const { email, password } = req.body
        const user: UserDocument = await UserModel.findOne({ email }).select('+password')
        const error: { message: string } = { message: 'email or password incorrect' }

        if (!user) {
          return res.status(HttpStatus.BAD_REQUEST).send(error)
        }

        const passwordCompare: boolean = await user.validatePassword(password)

        if (!passwordCompare) {
          return res.status(HttpStatus.BAD_REQUEST).send(errors)
        }

        res.json(buildUser(user))
      } catch (err) {
        next(err)
      }
    }]
)

export default router
