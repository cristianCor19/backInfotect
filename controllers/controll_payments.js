//When importing stripe it is imported as a class
import Stripe from "stripe"
import { KEYSTRIPE } from "../config.js";

import product from '../models/product.js'
import Cart from "../models/cart.js";
import Sales from '../models/sales.js'
import Order from '../models/order.js';



const stripe = new Stripe(KEYSTRIPE)

export async function createSession(req, res) {
    try {
        const cart = req.body;

        const orderData = {
            cartItems: cart.map(item => ({
                productId: item.product_id,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
                category: item.category
            })),
            userId: cart[0].user._id,
            orderDate: new Date()
        };

        const newOrder = await Order.create(orderData);

        const session = await stripe.checkout.sessions.create({
            line_items: cart.map(item => ({
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(item.price * 100),
                    product_data: {
                        name: item.name
                    }
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: `https://back-infotect.vercel.app/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            // success_url: `/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'https://back-infotect.vercel.app/payment/cancel',
            metadata: {
                orderId: newOrder._id.toString()
            }
        });

        return res.json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({
            error: 'Error creating session pay',
            details: error.message
        });
    }
}

export async function createCart(req, res) {
    try {
        const id = req.params.id
        const cart = req.body;
        const savedCartItems = await Promise.all(cart.map(async (product) => {
            const cartItem = new Cart({
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity,
                product_id: product._id,
                user: id,
                category: product.type
            });
            const res = await cartItem.save();
        }));


        return res.status(200).json({
            "status": true,
            "message": "Carrito guardado con exito"
        })
    } catch (error) {
        res.status(500).json({ error: 'error' });
    }
}

export async function obtainAllProductsCart(req, res) {
    try {
        let total = 0
        // let subtotals = []
        const carts = await Cart.find({
            user: req.user.id
        }).populate('user')

        const cartFound = carts.map(element => ({
            _id: element._id,
            name: element.name,
            price: element.price,
            quantity: element.quantity,
            image: element.image,
            product_id: element.product_id,
            category: element.category,
            user: {
                _id: element.user._id
            }
        }))

        carts.forEach(product => {
            total = total + product.price
        })

        return res.status(200).json({
            "status": true,
            "data": {
                carts: cartFound,
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
        const idProductCart = req.params.id

        const cartProductDeleted = await Cart.deleteMany({ product_id: idProductCart })

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

        cartProducts.map(async (productCart) => {
            const cartProductsDeleted = await Cart.deleteMany({ user: productCart.user._id })

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


        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            console.log('Payment confirmed as paid');
            // Get metada information

            const orderId = session.metadata.orderId;
            const orderInfo = await Order.findById(orderId);

            const productsCart = orderInfo.cartItems;


            // process each product in the cart
            await Promise.all(productsCart.map(async (productCart) => {
                try {
                    // Search product in the data base
                    const productFound = await product.findById(productCart.productId);

                    if (!productFound) {
                        console.error(`Product not found: ${productCart.id}`);
                        return;
                    }

                    const productId = productFound._id.toString();
                    console.log('Processing product:', productId);

                    // Verify and update inventory
                    if (productId === productCart.productId) {
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
                    console.error(`Error processing product ${productCart.productId}:`, error);
                    throw error; //
                }
            }));

            const userId = orderInfo.userId;
            
            //Clean the car if the process is correct
            const cartProductsDeleted = await Cart.deleteMany({
                user: userId
            });
            console.log('Cart products deleted:', cartProductsDeleted);

            // Record of sales
            const newOrder = await Sales.create({
                userId: userId,
                items: productsCart,
                stripeSessionId: session_id,
                totalAmount: session.amount_total/100,
                orderDate: orderInfo.orderDate
            });

            res.redirect('https://frontend-client-wine.vercel.app/ThanksPurchase');
            // res.redirect('/ThanksPurchase');
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
