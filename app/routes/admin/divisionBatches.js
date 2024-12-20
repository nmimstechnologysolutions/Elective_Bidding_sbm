import express from "express"
import { addDivisionBatchesController, deleteAllDivisionBatchesController, deleteDivisionBatchesController, divisionBatchesController, getGenerateDivBatchesExcelController, showDivBatchesByAcadSessionIdController, showDivBatchesByPorogramIdController, showDivBatchesEntriesController, showDivBatchesListByPagesController, updateDivisionBatchesController } from "../../controllers/admin/divisionBatches/index.js"
import { uploadFile } from '../../middleware/multerUpload.js'

const router = express.Router()

router.get('/dashboard/division-batches', divisionBatchesController)
router.get('/master-data/division-batches', divisionBatchesController)

router.post("/division-batches/show-entries", showDivBatchesEntriesController)
router.post('/division-batches/div-batch-by-pages', showDivBatchesListByPagesController)
router.post('/division-batches/div-batch-by-program', showDivBatchesByPorogramIdController)
router.post('/division-batches/div-batch-by-acad-session', showDivBatchesByAcadSessionIdController)
router.post('/division-batches/update-division-batch', updateDivisionBatchesController)
router.post('/division-batches/delete-division-batch', deleteDivisionBatchesController)

router.get("/division-batches/get-sample-div-batch-excel", getGenerateDivBatchesExcelController)
router.post("/division-batches/add-division-batch", uploadFile.single('excel-file'), addDivisionBatchesController)
router.post("/division-batches/delete-all-division-batch", deleteAllDivisionBatchesController)

export default router