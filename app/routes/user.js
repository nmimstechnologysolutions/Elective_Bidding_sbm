import express from 'express'
import { authenticateController, loginPageController, logoutController } from '../controllers/user.js'
import { body, check } from 'express-validator'


const router = express.Router()

router.get("/login", loginPageController)
router.post("/authenticate",[body('email').isEmail(),check('username').isLength({ min: 3 }).trim().escape(), check('password').isLength({min: 6}).trim()], authenticateController)
router.get("/logout", logoutController)

export default router