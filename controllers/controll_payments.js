//al importar stripe se importa como una clase
import Stripe from "stripe"
import { KEYSTRIPE } from "../config.js";
import product from '../models/product.js'
import Cart from "../models/cart.js";


const stripe = new Stripe(KEYSTRIPE)

export async function createSession(req, res) {
    try {
        const cart = req.body;

        // cart.map(product => {
        //     console.log(product.name);
        //     console.log(product.quantity);
        //     console.log(product.price);
        // })
        // Mapear cada producto en el carrito a un objeto compatible con Stripe
        const lineItems = cart.map(productCart => ({
            price_data: {
                product_data: {
                    name: productCart.name,

                },
                currency: 'usd', // Ajusta según tu configuración
                unit_amount: productCart.price * 100, // Convierte el precio a centavos (Stripe espera el precio en centavos)
            },
            quantity: productCart.quantity,
        }));

        // // Crear la sesión de Stripe con los productos del carrito
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/payment/success?products=${encodeURIComponent(JSON.stringify(cart))}`,
            cancel_url: 'http://localhost:3000/payment/cancel',
        });

        return res.json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function createCart(req, res) {
    try {
        const id = req.params.id
        const cart = req.body;
        console.log(id);
        const savedCartItems = await Promise.all(cart.map(async (product) => {
            const cartItem = new Cart({
                name: product.name,
                price: product.price,
                image: product.image, 
                quantity: product.quantity,
                product_id: product._id,
                user: id
            });
            const res =  await cartItem.save();
        }));
        return res.status(200).json({
            "status": true,
            "data": savedCartItems,
            "message": "Carrito guardado con exito"
        })
    } catch (error) {
        res.status(500).json({ error: 'error' });
    }
}

export async function obtainAllProductsCart(req, res) {
    try {
        let total = 0
        const carts = await Cart.find({
            user: req.user.id
        }).populate('user')

        carts.map(product => {
             total = total+ product.price 
        })
        console.log(total);
    
        return res.status(200).json({
            "status": true,
            "data": {
                carts: carts,
                total: total
            }
        })
    } catch (error) {
        return res.status(500).json({
            "status": true,
            "error": error
        })
    }
}

export async function deleteProductCart(req, res) {
    try {
        console.log('within deleteProductCart');
        const idProductCart = req.params.id

        const cartProductDeleted = await Cart.deleteMany({product_id:idProductCart})

        console.log(cartProductDeleted);
        return res.status(200).json({
            "status": true,
            "data": cartProductDeleted
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}

//borrar todos los productos del carrito 
export async function deleteAllProductsCart(req, res) {
    try {
        console.log('within deleteAllProductCart');
        const cartProducts = req.body
       
        cartProducts.map(async(productCart) => {
            const cartProductsDeleted = await Cart.deleteMany({user:productCart.user._id})

            
        })
        
        return res.status(200).json({
            "status": true,
            "message": "borrado correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}

export async function success(req, res){
    try {
        console.log('within success');
        // Obtener los productos desde la URL
        const productsParam = req.query.products;
        const productsCart = JSON.parse(decodeURIComponent(productsParam));
        // Ahora puedes procesar la información de los productos como desees
         productsCart.map(async(productCart) => {
            const productFound = await product.findById(productCart.product_id)
            // console.log(productFound);
            const productId = productFound._id.toString();
            console.log(productId );
            if(productId === productCart.product_id){
                const newQuantity = productFound.quantity - productCart.quantity
                await product.findByIdAndUpdate(productFound._id, { quantity: newQuantity });
                // console.log(newQuantity);
            }

            const cartProductsDeleted = await Cart.deleteMany({user: productCart.user})
            console.log(cartProductsDeleted);
            // console.log(productCart.user);
            
        })
        res.redirect('http://localhost:5173/ThanksPurchase');
    } catch (error) {
        console.error('Error processing success:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}



