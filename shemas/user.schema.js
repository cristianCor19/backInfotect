import {z} from 'zod'

// Validate that all the necessary parameters are sent in the user registration form
export const registerUserShema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido'
    }),
    email: z.string({
        required_error: 'El correo es requerido'
    }).email({
        message: 'El correo es invalido'
    }),
    password: z.string({
        required_error: 'La constraseña es requerida'
    }).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, {
        message: 'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial'
    }),

    

})


//modelo para la peticion de login, de forma que se envien todos los datos necesarios
// Template for login request, so that all necessary data is sent
export const loginUserSchema = z.object({
    email: z.string({
        required_error: 'El correo es requerido'
    }).email({
        message: 'El correo es invalido'
    }),

})