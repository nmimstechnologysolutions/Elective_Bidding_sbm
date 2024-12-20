import redisClient from "../config/redis.js"

export const sessionCheck = (req,res,next) => {
    if(req.session && req.session.userId){
        next()
    }else{
        res.redirect('/user/login')
    }
}

export const loginCheck = async (req,res,next) => {
    try{
        const sessionId = req.sessionID;

        if (!sessionId) {
            return res.redirect('/user/login');
        }

        redisClient.get(`sess:${sessionId}`, (err, result) => {
            if (err || !result) {
                return res.redirect('/user/login')
            }

            const sessionData = JSON.parse(result)

            res.locals.userId = sessionData.userId
            res.locals.firstName = sessionData.firstName
            res.locals.lastName = sessionData.lastName
            res.locals.username = sessionData.username
            res.locals.userSapId = sessionData.studentSapId
            res.locals.studentId = sessionData.studentId
            res.locals.role = sessionData.permissions

            const role = sessionData.permissions
            const currentPath = req.originalUrl.split('/')[1]

            // console.log(role)
            // console.log(currentPath)

           // Role-based URL enforcement
           if (role === 'admin' && currentPath.startsWith('student')) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err)
                    }
                    return res.redirect('/user/login')
                })
                return
            }

            if (role === 'student' && currentPath.startsWith('admin')) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err)
                    }
                    return res.redirect('/user/login')
                })
                return
            }


            next()
        })

    }catch(error){
        console.log("Error in loginCheck middleware", error.message)
        return res.redirect('/user/login')
    }
}

export const redirectLogin = async (req,res,next) => {
    try{
        const sessionId = req.sessionID;

        if (!sessionId) {
            return next()
        }

        redisClient.get(`sess:${sessionId}`, (err, result) => {
            if (err || !result) {
                return next()
            }

            const sessionData = JSON.parse(result)

            if (sessionData.modules && sessionData.modules.length > 0) {
                return res.redirect(`/${sessionData.modules}/dashboard`)
            } else {
                return next()
            }
        })
    }catch(error){
        console.log("Error in redirect Login middleware", error.message)
        return res.redirect('/user/login')
    }
}