import mongoose, {model} from "mongoose";
const {Schema} = mongoose

const orderShema = new Schema(
    {
        cartItems: {
            type: Array,
            required: true
        },
        userId: {
            type : String,
            required: true
        },
        orderDate: {
            type: Date,
            required: true
        }
    }
)

export default model('Order', orderShema)