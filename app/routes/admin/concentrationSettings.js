import express from "express"
import { concentrationSettingsController, concentrationSettingsListByRefreshController, deleteConcentrationSettingsController, updateConcentrationSettingsController } from "../../controllers/admin/concentrationSettings/index.js"

const router = express.Router()

router.get('/dashboard/concentration-settings', concentrationSettingsController)
router.get('/bidding-settings/concentration-settings', concentrationSettingsController)

router.post('/concentration-settings/concentration-settings-by-refresh', concentrationSettingsListByRefreshController)
router.post('/concentration-settings/update-concentration-settings', updateConcentrationSettingsController)
router.post('/concentration-settings/delete-concentration-settings', deleteConcentrationSettingsController)
export default router