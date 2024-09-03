import { Router } from "express";
import { loginUserSchema } from '../shemas/user.schema.js'

import {
    loginUser,
    sendMailRecoveryPass,
    verifyToken,
    logout,
    verifyUser,
    updatePasswordRecovery 
    
} from "../controllers/controll_session";

const router = Router();

router.post('/login', validateSchema(loginUserSchema), loginUser)
router.get('/verifyUser/:token', verifyUser)
router.get('/verify/:token', verifyToken)
router.post('/logout', verifyToken, logout)
router.put('/updatePasswordRecovery', updatePasswordRecovery)
router.post('/sendEmail/email', sendMailRecoveryPass)

export default router;