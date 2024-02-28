import {z} from 'zod'

//validar que se registren todos los datos que se piden en el formulario de registro de productos
export const registerProductShema = z.object({
    id_product: z.string({
        required_error: 'El nombre es requerido'
    }),

    name: z.string({
        required_error: 'El nombre es requirido'
    }),

    price: z.number({
        required_error: 'El precio es requerido'
    }),

    description: z.string({
        required_error: 'La descripción es requerida'
    }),

    image: z.string({
        required_error: 'La imagen es requerida'
    }),

    quantity: z.number({
        required_error: 'La cantidad es requerida'
    }),

    type: z.string({
        required_error: 'El tipo de producto es requerido'
    })

})

