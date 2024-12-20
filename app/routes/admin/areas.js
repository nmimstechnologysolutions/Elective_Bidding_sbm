import express from 'express'
import { areasController, getAreasListByRefreshController } from '../../controllers/admin/areas/index.js'

const router = express.Router()

router.get('/dashboard/areas', areasController)
router.get('/master-data/areas', areasController)

router.post('/areas/areas-by-refresh', getAreasListByRefreshController)


export default router