import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id_user: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      enum: ['employee', 'customer', 'administrator'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

// Agregar campo autoincremental
userSchema.add({
  autoIncrement: {
    type: Number,
    unique: true,
  },
});

// Configurar middleware para generar el valor autoincremental antes de guardar
userSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.id_user) {
    // Solo generamos el nuevo valor si no se proporcionó un id manualmente
    try {
      const maxIdDoc = await doc.constructor.findOne().sort('-id_user');
      doc.id_user = maxIdDoc ? maxIdDoc.id_user + 1 : 1;
      doc.autoIncrement = doc.id_user + 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default model('User', userSchema);
