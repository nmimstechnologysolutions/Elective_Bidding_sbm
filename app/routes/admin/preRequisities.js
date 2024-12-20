import express from "express"
import { addPreRequisiteCourseController, deletePreRequisiteCourseController, editPreRequisiteCourseController, preRequisiteCourseListByAcadSessionController, preRequisitesController } from "../../controllers/admin/preRequisities/index.js"

const router = express.Router()

router.get('/dashboard/pre-requisites', preRequisitesController)
router.get('/master-data/pre-requisites', preRequisitesController)

router.post('/pre-requisites/course-list-by-acad-sessions', preRequisiteCourseListByAcadSessionController)
router.post('/pre-requisites/add-pre-requisites', addPreRequisiteCourseController)
router.post('/pre-requisites/edit-pre-requisite', editPreRequisiteCourseController)
router.post('/pre-requisites/delete-pre-requisite', deletePreRequisiteCourseController)


export default router