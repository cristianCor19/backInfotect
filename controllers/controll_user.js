import User from '../models/user.js'
import { genSalt, hash, compare } from 'bcrypt'
import { createAccessToken } from '../libs/jwt.js'


export async function saveUser(req, res) {
    try {
        const { id_user, name, lastname, email, password, phone, role } = req.body
        const userFound = await User.findOne({ email: email })
        if (!userFound) {
            const salt = await genSalt(10)
            const hashedPassword = await hash(password, salt)
            const newUser = new User({
                id_user,
                name,
                lastname,
                email,
                password: hashedPassword,
                phone,
                role
            })

            const dataUserSave = await newUser.save()

            const token = await createAccessToken({ id: dataUserSave._id, role: dataUserSave.role })
          

            return res.status(200).json({
                "status": true,
                "data": dataUserSave,
                "token": token
            })
        } else {
            return res.status(200).json({
                "status": false,
                "error": error,
                "message": "Correo ya registrado"
            })
        }
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}
export async function obtainAllUsers(req, res) {
    try {
        const dataUsers = await User.find()
        return res.status(200).json({
            "status": true,
            "data": dataUsers
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}
export async function findUserById(req, res) {
    try {
        const id = req.params.id
        const dataUser = await User.findById(id)
        return res.status(200).json({
            "status": true,
            "dataUser": dataUser
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}
export async function deleteUser(req, res) {
    try {
        const id = req.params.id
        const userDeleted = await User.findByIdAndDelete(id)
        return res.status(200).json({
            "status": true,
            "userDeleted": userDeleted
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}



export async function profile(req, res) {
    const userFound = await User.findById(req.user.id)

    if (!userFound) return res.status(404).json({
        message: 'Usuario no encontrado'
    })

    return res.json({
        _id: userFound._id,
        id_user: userFound.id,
        name: userFound.name,
        lastname: userFound.lastname,
        email: userFound.email
    })
}

