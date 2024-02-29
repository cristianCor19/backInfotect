import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectToDatabase from './drivers/connect_bd.js';
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import paymentRoutes from './routes/payment.routes.js'
// const { auth,requiresAuth } = require('express-openid-connect');
const app = express()
// const { swaggerUi, specs } = require('./swagger')
import dotenv from 'dotenv';
dotenv.config();




app.set('PORT', process.env.PORT)
app.use(express.json())
app.use(cookieParser())

//configuracion de cors para tener diferentes rutas de origen para usar la api

const corsOptions = {
    credentials: true,
    origin: ['https://frontend-client-wine.vercel.app', 'http://localhost:5173']
};

app.use(cors(corsOptions));
// app.use(auth(config));

app.listen(app.get('PORT'), ()=>{
    console.log(`Server listen to port: ${app.get('PORT')}` );
})

connectToDatabase();



app.use('/user',userRoutes) 
app.use('/product',productRoutes)   
app.use('/payment', paymentRoutes)