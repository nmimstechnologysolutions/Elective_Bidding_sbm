import express from 'express'
import { addFavCourseController, completedRoundResultController, dashboardController, fetchAllCourseController, filterCourseController, saveConcentrationController, searchCourseController } from '../../controllers/student/dashboard/index.js'

const router = express.Router()

router.get('/dashboard', dashboardController)

router.post('/dashboard/save-concentration', saveConcentrationController)
router.post('/dashboard/add-favourite', addFavCourseController)
router.get('/dashboard/all-courses', fetchAllCourseController)
router.post('/dashboard/filter-courses', filterCourseController)
router.post('/dashboard/search-courses', searchCourseController)
router.post('/dashboard/completed-round', completedRoundResultController)


export default router