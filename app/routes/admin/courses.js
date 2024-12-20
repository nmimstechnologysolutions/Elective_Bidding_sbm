import express from 'express'
import { addCourseController, coursesController, deleteAllCoursesController, deleteCourseController, getCourseListByAcadSessionIdController, getCourseListByCourseIdController, getCourseListByProgramIdController, getGenerateCourseExcelController, showCourseEntriesController, showCoursesDataByPagesController, updateCourseController } from '../../controllers/admin/courses/index.js'
import { uploadFile } from '../../middleware/multerUpload.js'

const router = express.Router()

router.get('/dashboard/courses', coursesController)
router.get('/master-data/courses', coursesController)

router.post('/courses/show-entries', showCourseEntriesController)
router.post('/courses/course-by-pages', showCoursesDataByPagesController)
router.post('/courses/courses-by-program', getCourseListByProgramIdController)
router.post('/courses/courses-by-acad-session', getCourseListByAcadSessionIdController)
router.post('/courses/courses-by-course', getCourseListByCourseIdController)
router.post('/courses/update-course', updateCourseController)
router.post('/courses/delete-course', deleteCourseController)

router.get('/courses/get-sample-course-excel', getGenerateCourseExcelController)
router.post('/courses/add-course', uploadFile.single('excel-file'), addCourseController)
router.post('/courses/delete-all-course', deleteAllCoursesController)

export default router