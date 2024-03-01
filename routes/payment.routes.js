import { Router } from "express";
import { authRequired } from '../middlewares/validateToken.js'

import { 
    createSession,
    success,
    createCart,
    obtainAllProductsCart,
    deleteProductCart,
    deleteAllProductsCart
} from "../controllers/controll_payments.js";


const router = Router();


// advanced navigation routes for the shopping car
router.get('/success', success)
router.get('/cancel')
router.get('/obtainAllProductsCart/:token', authRequired, obtainAllProductsCart)
router.post('/create-checkout-sesion', createSession)
router.post('/deleteAllProductsCart', deleteAllProductsCart)
router.post('/createCart/:id', createCart)
router.delete('/deleteProductCart/:id', deleteProductCart)


export default router;