import express from 'express'
import { confirmationRoundController } from '../../controllers/student/confirmation/index.js'


const router = express.Router()

router.get('/confirmation', confirmationRoundController)

export default router