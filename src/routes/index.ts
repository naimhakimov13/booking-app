import express from 'express'

import auth from './auth.routes'
import user from './user.routes'
import company from './company.routes'
import table from './table.routes'
import file from './file.routes'
import booking from './booking.routes'
import main from './main.routes'

const router = express.Router({ mergeParams: true })

router.use('/main', main)
router.use('/', auth)
router.use('/user', user)
router.use('/company', company)
router.use('/table', table)
router.use('/img', file)
router.use('/booking', booking)

export default router
