import express from "express"
import { addStudentsDataController, deleteAllStudentsDataController, deleteStudentsDataController, getGenerateStudentsDataExcelController, getStudentListByProgramIdController, getStudentListByStudentIdController, showStudentDataByPagesController, showStudentEntriesController, studentsDataController, updateStudentsDataController } from "../../controllers/admin/studentsData/index.js"
import { uploadFile } from "../../middleware/multerUpload.js"

const router = express.Router()

router.get('/dashboard/students-data', studentsDataController)
router.get('/master-data/students-data', studentsDataController)

router.post('/students-data/show-entries', showStudentEntriesController)
router.post("/students-data/students-by-pages", showStudentDataByPagesController)
router.post("/students-data/students-by-program", getStudentListByProgramIdController)
router.post("/students-data/students-by-student", getStudentListByStudentIdController)
router.post('/students-data/update-student', updateStudentsDataController)
router.post('/students-data/delete-student', deleteStudentsDataController)

router.get("/students-data/get-sample-students-data-excel", getGenerateStudentsDataExcelController)
router.post("/students-data/add-student", uploadFile.single('excel-file'), addStudentsDataController)
router.post("/students-data/delete-all-student", deleteAllStudentsDataController)

export default router