import dashboardRoute from './dashboard.js'
import demandEstimationRoute from './demandEstimation.js'
import biddingRoute from './bidding.js'
import confirmationRoute from './confirmation.js'
import waitingListRoute from './waitingList.js'
import addDropRoute from './addDrop.js'
import { loginCheck, sessionCheck } from '../../middleware/user.js'

const StudentRoute = (app) => {
    app.use('/student/', loginCheck, sessionCheck, dashboardRoute)
    app.use('/student/', loginCheck, sessionCheck, demandEstimationRoute)
    app.use('/student/', loginCheck, sessionCheck, biddingRoute)
    app.use('/student/', loginCheck, sessionCheck, confirmationRoute)
    app.use('/student/', loginCheck, sessionCheck, waitingListRoute)
    app.use('/student/', loginCheck, sessionCheck, addDropRoute)
}

export default StudentRoute