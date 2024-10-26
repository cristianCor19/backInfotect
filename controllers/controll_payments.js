//al importar stripe se importa como una clase
import Stripe from "stripe"
import { KEYSTRIPE } from "../config.js";
import product from '../models/product.js'
import Cart from "../models/cart.js";


const stripe = new Stripe(KEYSTRIPE)

export async function createSession(req, res) {
    try {
        const cart = req.body;
        
        // Preparar datos para metadata
        const orderData = {
            cartItems: cart.map(item => ({
                productId: item.product_id,
                quantity: item.quantity,
                name: item.name
            })),
            userId: cart[0].user._id,
            orderDate: new Date().toISOString()
        };

        const session = await stripe.checkout.sessions.create({
            line_items: cart.map(item => ({
                price_data: {
                    currency: 'usb',
                    unit_amount: Math.round(item.price * 100),
                    product_data: {
                        name: item.name
                    }
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'https://back-infotect.vercel.app/payment/cancel',
            metadata: {
                orderInfo: JSON.stringify(orderData),
                // sessionId: CHECKOUT_SESSION_ID,
                totalItems: cart.length,
                cartInfo: JSON.stringify(cart.map(item => ({
                    id: item.product_id,
                    quantity: item.quantity,
                    name: item.name,
                    user: item.user._id
                })))
            }
        });
        
        return res.json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ 
            error: 'Error creando la sesión de pago',
            details: error.message 
        });
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
        console.log('test subtotal');
        let total = 0
        let subtotals = []
        const carts = await Cart.find({
            user: req.user.id
        }).populate('user')

    

        carts.forEach(product => {
            total = total+ product.price 
        })
        
    
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

// 2. Procesar el éxito del pago
export async function success(req, res) {
    try {
        console.log('Processing success payment');
        const { session_id } = req.query;
        console.log(session_id);
        
        
        if (!session_id) {
            throw new Error('No session_id provided');
        }

        // Recuperar la sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        // Verificar que el pago fue exitoso
        if (session.payment_status === 'paid') {
            console.log('Payment confirmed as paid');
            
            // Obtener la información que guardamos en metadata
            const orderInfo = JSON.parse(session.metadata.orderInfo);
            const productsCart = JSON.parse(session.metadata.cartInfo);
            
            console.log('Order info recovered:', orderInfo);
            console.log('Products recovered:', productsCart);

            // Procesar cada producto del carrito
            await Promise.all(productsCart.map(async (productCart) => {
                try {
                    // Buscar el producto en la base de datos
                    const productFound = await product.findById(productCart.id);
                    
                    if (!productFound) {
                        console.error(`Product not found: ${productCart.id}`);
                        return;
                    }

                    const productId = productFound._id.toString();
                    console.log('Processing product:', productId);

                    // Verificar y actualizar inventario
                    if (productId === productCart.id) {
                        const newQuantity = productFound.quantity - productCart.quantity;
                        
                        if (newQuantity < 0) {
                            console.error(`Insufficient quantity for product: ${productCart.name}`);
                            throw new Error(`Insufficient inventory for ${productCart.name}`);
                        }

                        await product.findByIdAndUpdate(productFound._id, {
                            quantity: newQuantity
                        });
                        console.log(`Updated quantity for ${productCart.name}: ${newQuantity}`);
                    }
                } catch (error) {
                    console.error(`Error processing product ${productCart.id}:`, error);
                    throw error; // Propagar el error para manejar el fallo de la transacción
                }
            }));

            // Limpiar el carrito una vez que todo se procesó correctamente
            const cartProductsDeleted = await Cart.deleteMany({
                user: productsCart[0].user
            });
            console.log('Cart products deleted:', cartProductsDeleted);

            // Registro de la orden 
            // const newOrder = await Order.create({
            //     userId: productsCart[0].user,
            //     items: productsCart,
            //     stripeSessionId: session_id,
            //     totalAmount: session.amount_total,
            //     orderDate: orderInfo.orderDate
            // });

            res.redirect('https://frontend-client-wine.vercel.app/ThanksPurchase');
        } else {
            throw new Error('Payment not completed');
        }
    } catch (error) {
        console.error('Error processing success:', error);
        res.status(500).json({
            error: 'Error procesando el pago',
            details: error.message
        });
    }
}
