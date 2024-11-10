import mongoose, {model} from 'mongoose';
const {Schema} = mongoose;

const favoriteSchema = new Schema(
    {
        name: {
            type: String, 
        },
        price: {
            type: Number,
        },
        quantity: {
            type: Number,
        },
        image: {
            type: String,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
         
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
       
        }
    }
)

export default model('favorite', favoriteSchema)