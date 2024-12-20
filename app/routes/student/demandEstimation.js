import express from 'express'
import { demandEstimationRoundController, filterByAcadSessionController, filterByAreaController } from '../../controllers/student/demandEstimation/index.js'

const router = express.Router()

router.get('/demand-estimation', demandEstimationRoundController)
router.post('/demand-estimation/filter-by-acad-session', filterByAcadSessionController)
router.post('/demand-estimation/filter-by-area', filterByAreaController)

export default router