import express from "express"
import { addCompletedCourseController, completedCourseController, deleteAllCompletedCourseController, deleteCompletedCourseController, getGenerateCompletedCourseExcelController, updateCompletedCourseController } from "../../controllers/admin/completedCourses/index.js"
import { uploadFile } from "../../middleware/multerUpload.js"

const router = express.Router()

router.get('/dashboard/completed-courses',completedCourseController)
router.get('/master-data/completed-courses',completedCourseController)

router.post('/completed-courses/update-complete-course', updateCompletedCourseController)
router.post('/completed-courses/delete-complete-course',deleteCompletedCourseController)

router.get('/completed-courses/get-sample-complete-course-excel', getGenerateCompletedCourseExcelController)
router.post('/completed-courses/add-completed-course', uploadFile.single('excel-file'), addCompletedCourseController)
router.post('/completed-courses/delete-all-complete-course', deleteAllCompletedCourseController)

export default router