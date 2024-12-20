import express from "express"
import { addRoundSettingsRoundController, deleteRoundSettingsRoundController, roundDataController, roundSettingsController, updateRoundSettingsRoundController } from "../../controllers/admin/roundSettings/index.js"

const router = express.Router()

router.get('/dashboard/round-settings', roundSettingsController)
router.get('/bidding-settings/round-settings', roundSettingsController)

router.post('/round-settings/data-round-settings',roundDataController)
router.post('/round-settings/add-round-settings', addRoundSettingsRoundController)
router.post('/round-settings/update-round-settings', updateRoundSettingsRoundController)
router.post('/round-settings/delete-round-settings', deleteRoundSettingsRoundController)

export default router