import express from 'express'
import { biddingRoundController } from '../../controllers/student/bidding/index.js'

const router = express.Router()

router.get('/bidding', biddingRoundController)

export default router