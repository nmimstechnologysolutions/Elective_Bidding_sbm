import express from 'express'
import { biddingSettingsController, dashboardController, masterDataController, reportsController, utilityController } from '../../controllers/admin/dashboard/index.js'
import { electiveTimetableController } from '../../controllers/admin/electiveTimetable/index.js'
import { manualEnrollmentController } from '../../controllers/admin/manualEnrollment/index.js'

const router = express.Router()

router.get('/dashboard', dashboardController)
router.get('/master-data', masterDataController)
router.get('/bidding-settings', biddingSettingsController)
router.get('/elective-timetable', electiveTimetableController)
router.get('/manual-enrollment', manualEnrollmentController)
router.get('/reports', reportsController)
router.get('/utility', utilityController)

export default router