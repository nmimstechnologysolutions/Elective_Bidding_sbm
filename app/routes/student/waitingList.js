import express from "express"
import { waitingListRoundController } from "../../controllers/student/waitingList/index.js"

const router = express.Router()

router.get('/waiting-list', waitingListRoundController)

export default router