import mongoose, {model} from "mongoose";
const {shema} = mongoose;

const purchaseSchema = new Schema(
    {
        nameProduct: {
            type: String,
            required: true
        },

        quantityProduct: {
            type: Number,
            required: true

        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)