import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectToDatabase from './drivers/connect_bd.js';
import userRoutes from './routes/user.routes.js'
import sessionRoutes from './routes/session.routes.js';
import productRoutes from './routes/product.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import soldRoutes from './routes/stats.routes.js';

const app = express()

import dotenv from 'dotenv';
dotenv.config();

app.set('PORT', process.env.PORT)
app.use(express.json())
app.use(cookieParser())

//Configuration of cors to have different source paths when using in the api

const corsOptions = {
    credentials: true,
    origin: [ "https://frontend-administrator-kappa.vercel.app","https://frontend-client-pink.vercel.app",]
};

app.use(cors(corsOptions));

app.listen(app.get('PORT'), ()=>{
    console.log(`Server listen to port: ${app.get('PORT')}` );
})

connectToDatabase();


app.use('/session', sessionRoutes)
app.use('/user',userRoutes) 
app.use('/product',productRoutes)   
app.use('/payment', paymentRoutes)
app.use('/stats', soldRoutes)
