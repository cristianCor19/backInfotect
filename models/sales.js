import mongoose, {model} from "mongoose";
const {Schema} = mongoose;

const salesModel = new Schema({
    userId: {
        type : String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    }
})

export default model('Sales', salesModel)
