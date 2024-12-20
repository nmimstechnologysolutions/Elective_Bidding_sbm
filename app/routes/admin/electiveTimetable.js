import express from 'express'
import { addElectiveTimetableController, deleteElectiveTimetableByAcadSessionController, electiveTimetableAsPerDayController, electiveTimetableController, getAcadSessionByProgramForDeleteController, getGenerateExcelController } from '../../controllers/admin/electiveTimetable/index.js'
import { uploadFile } from '../../middleware/multerUpload.js'

const router = express.Router()

router.get('/dashboard/elective-timetable', electiveTimetableController)
router.post('/elective-timetable/timetable-by-day', electiveTimetableAsPerDayController)
router.post('/elective-timetable/acad-session-by-program', getAcadSessionByProgramForDeleteController)

router.get('/elective-timetable/get-sample-excel', getGenerateExcelController)
router.post("/elective-timetable/add-timetable", uploadFile.single('excel-file'), addElectiveTimetableController)
router.post('/elective-timetable/delete-timetable', deleteElectiveTimetableByAcadSessionController)

export default router