import User from "../models/User.js";
import { isJsonString } from "../utils/util.js";
import { verifyPassword } from "../utils/hash.js";

export const loginPageController = async (req,res) => {
    try{    
        res.render('login')
    }catch(error){
        console.log(error.message)
        if (isJsonString(error.originalError.info.message)) { 
            res.status(500).json(JSON.parse(error.originalError.info.message));
        } else {
            res.status(500).json({
                status: 500,
                description: error.originalError.info.message,
                data: []
            })
        }
    }
}


export const authenticateController = async (req,res) => {
    try {
        const { username, password } = req.body

        // Fetch user data
        const userData = await User.userDetails(res.locals.slug, res.locals.biddingId, { username })
        // console.log('User Data:', userData)

        // Handle invalid user
        if (!userData || userData.length === 0) {
            return res.render('login', { message: "Invalid username or password" })
        }

        // Verify password
        const isVerified = await verifyPassword(password, userData[0].password)
        // console.log('Password Verification Result:', isVerified);

        if (!isVerified) {
            return res.render('login', { message: "Login Failed" })
        }

        // console.log(user)

        // Set session data
        const user = userData[0]
        req.session.userId = user.id
        req.session.username = user.username
        req.session.firstName = user.first_name
        req.session.lastName = user.last_name
        req.session.fullName = user.first_name + ' ' + user.last_name
        req.session.email = user.email
        req.session.subDomain = req.headers.host.split('.')[0]
        req.session.studentSapId = user.sap_id
        req.session.studentId = user.student_lid
        req.session.permissions = user.role_name
        req.session.modules = user.role_name

        // Redirect based on role
        if (user.role_name === 'admin') {
            return res.redirect('/admin/dashboard')
        } else if (user.role_name === 'student') {
            return res.redirect('/student/dashboard')
        }

        // Fallback response for unknown roles
        return res.send('This user has no permissions.')
    } catch (error) {
        console.error('Error during authentication:', error)
        return res.render('login', {
            message: "An error occurred during authentication",
        })
    }
}

export const logoutController = (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err)
            return res.status(500).send("Logout failed")
        }

        res.clearCookie("connect.sid")
        return res.redirect('/user/login')
    })
}