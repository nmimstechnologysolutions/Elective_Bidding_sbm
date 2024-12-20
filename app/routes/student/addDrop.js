import express from 'express'
import { addDropRoundController } from '../../controllers/student/addDrop/index.js'

const router = express.Router()

router.get('/add-drop', addDropRoundController)

export default router