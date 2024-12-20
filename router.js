import StudentRoute from "./app/routes/student/index.js"
import AdminRoute from "./app/routes/admin/index.js"
import UserRoute from "./app/routes/user.js"
import { redirectLogin } from "./app/middleware/user.js"

const setRouter = (app) => {

    app.use('/user', (req, res, next) => {
        if (req.path === '/logout') return next(); // Skip middleware for logout
        return redirectLogin(req, res, next);
    }, UserRoute)

    AdminRoute(app) // admin routes

    StudentRoute(app) // students routes
}

export default setRouter