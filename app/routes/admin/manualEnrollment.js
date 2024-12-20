import express from 'express'
import { addStuentToEnrollmentController, getCourseListController, manualEnrollmentController } from '../../controllers/admin/manualEnrollment/index.js'

const router = express.Router()

router.get('/dashboard/manual-enrollment', manualEnrollmentController)
router.post('/manual-enrollment/course-list', getCourseListController)
router.post('/manual-enrollment/add-enrollment', addStuentToEnrollmentController)

export default router