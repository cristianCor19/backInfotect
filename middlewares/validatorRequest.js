//Middleware para validar el cuerpo de una solicitud

export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        
        error.errors.map((erro) => {
            
        })

        return res.status(400).json(error.errors.map(error => error.message))
    }


}