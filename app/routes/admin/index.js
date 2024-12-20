import dashboardRoute from './dashboard.js'
import biddingSessionsRoute from './biddingSessions.js'
import programRoute from './programs.js'
import coursesRoute from './courses.js'
import programSessionRoute from './programSessions.js'
import areasRoute from './areas.js'
import specializationRoute from './specialization.js'
import concentrationSettingsRoute from './concentrationSettings.js'
import studentsDataRoute from './studentsData.js'
import preRequisitiesRoute from './preRequisities.js'
import completedCoursesRoute from './completedCourses.js'
import divisionBatchesRoute from './divisionBatches.js'
import electiveTimetableRoute from './electiveTimetable.js'
import roundSettingsRoute from './roundSettings.js'
import bonusPointsRoute from './bonusPoints.js'
import manaualEnrollmentRoute from './manualEnrollment.js'
import { loginCheck, sessionCheck } from '../../middleware/user.js'

const AdminRoute = (app) => {
    app.use('/admin/', loginCheck, sessionCheck, dashboardRoute)
    app.use('/admin/', loginCheck, sessionCheck, dashboardRoute)
    app.use('/admin/', loginCheck, sessionCheck, biddingSessionsRoute)
    app.use('/admin/', loginCheck, sessionCheck, programRoute)
    app.use('/admin/', loginCheck, sessionCheck, coursesRoute)
    app.use('/admin/', loginCheck, sessionCheck, programSessionRoute)
    app.use('/admin/', loginCheck, sessionCheck, areasRoute)
    app.use('/admin/', loginCheck, sessionCheck, specializationRoute)
    app.use('/admin/', loginCheck, sessionCheck, concentrationSettingsRoute)
    app.use('/admin/', loginCheck, sessionCheck, studentsDataRoute)
    app.use('/admin/', loginCheck, sessionCheck, preRequisitiesRoute)
    app.use('/admin/', loginCheck, sessionCheck, completedCoursesRoute)
    app.use('/admin/', loginCheck, sessionCheck, divisionBatchesRoute)
    app.use('/admin/', loginCheck, sessionCheck, electiveTimetableRoute)
    app.use('/admin/', loginCheck, sessionCheck, roundSettingsRoute)
    app.use('/admin/', loginCheck, sessionCheck, bonusPointsRoute)
    app.use('/admin/', loginCheck, sessionCheck, manaualEnrollmentRoute)
}

export default AdminRoute