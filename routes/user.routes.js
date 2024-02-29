import { Router } from 'express'
//funciones para la coleccion de usuarios
import {
    obtainAllUsers,
    saveUser,
    findUserById,
    deleteUser,
    loginUser,
    sendMailRecoveryPass,
    profile,
    verifyToken,
    logout,
    verifyUser,
    updatePasswordRecovery
} from '../controllers/controll_user.js'
//modelo para la validacion del cuerpo de las peticiones
import { registerUserShema, loginUserSchema } from '../shemas/user.schema.js'
//funcion para validar el modelo de las peticiones
import { validateSchema } from '../middlewares/validatorRequest.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()
//configuracion de rutas para la parte de usuarios
router.post('/registerUser', validateSchema(registerUserShema), saveUser)
router.post('/login', validateSchema(loginUserSchema), loginUser)
router.get('/verifyUser/:token', verifyUser)
router.get('/verify/:token', verifyToken)
router.post('/logout', verifyToken, logout)
router.get('/', obtainAllUsers)
router.get('/profile/:token', authRequired, profile)

router.delete('/:id', deleteUser)
router.put('/updatePasswordRecovery', updatePasswordRecovery)
router.post('/sendEmail/email', sendMailRecoveryPass)
router.get('/:id', findUserById)



export default router