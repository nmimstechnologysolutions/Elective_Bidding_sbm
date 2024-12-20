import express from 'express'
import { addNewBiddingSessionController, biddingSessionsController, deleteBiddingSessionController, editBiddingSessionController, getActiveBiddingSessionsController, setActiveBiddingSessionController } from '../../controllers/admin/biddingSessions/index.js'

const router = express.Router()

router.get('/dashboard/bidding-sessions', biddingSessionsController)
router.get('/master-data/bidding-sessions', biddingSessionsController)

router.post('/bidding-sessions/set-active-bidding-session', setActiveBiddingSessionController)
router.post('/bidding-sessions/active-bidding-session', getActiveBiddingSessionsController)
router.post('/bidding-sessions/add-bidding-session', addNewBiddingSessionController)
router.post('/bidding-sessions/edit-bidding-session', editBiddingSessionController)
router.post('/bidding-sessions/delete-bidding-session', deleteBiddingSessionController)

export default router