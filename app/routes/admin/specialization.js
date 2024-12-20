import express from 'express'
import { addSpecializationController, deleteSpecializationController, specializationController, updateSpecializationController } from '../../controllers/admin/specialization/index.js'

const router = express.Router()

router.get('/dashboard/specialization', specializationController)
router.get('/master-data/specialization', specializationController)

router.post('/specialization/add-specialization', addSpecializationController)
router.post('/specialization/update-specialization', updateSpecializationController)
router.post('/specialization/delete-specialization', deleteSpecializationController)

export default router