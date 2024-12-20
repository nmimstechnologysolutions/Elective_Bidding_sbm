import express from "express"
import { addBonusPointsController, bonusPointsController, deleteBonusPointsController, editBonusPointsController } from "../../controllers/admin/bonusPoints/index.js"

const router = express.Router()

router.get('/dashboard/bonus-points', bonusPointsController)
router.get('/master-data/bonus-points', bonusPointsController)

router.post('/bonus-points/add-bonus-points', addBonusPointsController)
router.post('/bonus-points/edit-bonus-points', editBonusPointsController)
router.post('/bonus-points/delete-bonus-points', deleteBonusPointsController)

export default router