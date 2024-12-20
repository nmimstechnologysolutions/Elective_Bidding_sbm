import express from 'express'
import { programSessionController, programSessionsListByRefreshController, updateProgramSessionController } from '../../controllers/admin/programSessions/index.js'

const router = express.Router()

router.get('/dashboard/program-sessions', programSessionController)
router.get('/master-data/program-sessions', programSessionController)

router.post('/program-sessions/program-session-by-refresh', programSessionsListByRefreshController)
router.post('/program-sessions/update-program-session', updateProgramSessionController)

export default router