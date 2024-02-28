import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    id_product: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    type: {
      type: String,
      enum: ['Partes pc', 'Monitores', 'Perifericos', 'Portátiles'],
      required: true
    }
  },
  {
    timestamps: true,
  }
)

export default model('product', productSchema);