import express from 'express'
import { addProgramController, deleteProgramController, programsController } from '../../controllers/admin/programs/index.js'

const router = express.Router()

router.get('/dashboard/programs', programsController)
router.get('/master-data/programs', programsController)

router.post('/programs/add-program', addProgramController)
router.post('/programs/delete-program', deleteProgramController)


export default router