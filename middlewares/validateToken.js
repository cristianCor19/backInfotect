//los middlewares son funciones las cuales se ejecutan antes de llegar a una ruta
//en esta clase se valida el token que se genera para validar si un usuario esta registrado y logueado

import jwt from 'jsonwebtoken'


export const authRequired = (req, res, next) => {

    const {token} = req.cookies 

    if(!token) return res.status(401).json({message: 'No existe el token, autorizacion denegada' })

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({message: 'Token invalido'})

        req.user = user

        next()
    })
}