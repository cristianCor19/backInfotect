import {Router} from 'express'
const router = Router()

//funciones para la coleccion de usuarios
import {saveProduct, obtainAllProducts,  deleteProduct, findProductById} from '../controllers/controll_product.js'

//modelo para la validacion del cuerpo de las peticiones
import { registerProductShema } from '../shemas/product.shema.js'
//funcion para validar el modelo de las peticiones
import { validateSchema } from '../middlewares/validatorRequest.js'


//configuracion de rutas para la parte de usuarios
router.get('/', obtainAllProducts)
router.post('/registerProduct', saveProduct)
router.get('/:id', findProductById)
router.delete('/:id', deleteProduct)



export default router