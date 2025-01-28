import {Router} from 'express'
const router = Router()
import { authRequired } from '../middlewares/validateToken.js'
//funciones para la coleccion de usuarios
import {
    saveProduct,
    obtainAllProducts,
    deleteProduct,
    findProductById,
    searchProducts,
    createFavorites,
    deleteFavorite,
    getAllProductsFavorites
} from '../controllers/controll_product.js'

//modelo para la validacion del cuerpo de las peticiones
import { registerProductShema } from '../shemas/product.shema.js'
//funcion para validar el modelo de las peticiones
import { validateSchema } from '../middlewares/validatorRequest.js'


//configuracion de rutas para la parte de usuarios
router.get('/', obtainAllProducts)
router.get('/get_favorites/:token',authRequired, getAllProductsFavorites)
router.get('/searchProducts', searchProducts)
router.post('/register-product', saveProduct)
router.post('/createFavorites/:id', createFavorites)
router.get('/:id', findProductById)
router.delete('/:id', deleteProduct)
router.delete('/delete_favorite/:idProduct/:idUser', deleteFavorite)


export default router