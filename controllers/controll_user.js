import User from '../models/user.js'
import { genSalt, hash } from 'bcrypt'

export async function saveUser(req, res) {
    try {
        const { name,email, password,  } = req.body
        
        
        const userFound = await User.findOne({ email: email })
        if (!userFound) {
            const salt = await genSalt(10)
            const hashedPassword = await hash(password, salt)
            const newUser = new User({
                // id_user,
                name,
                // lastname,
                email,
                password: hashedPassword,
                // phone,
                // role
            })

            const dataUserSave = await newUser.save()

            return res.status(200).json({
                "status": true,
                "message": "User saved successfully",
            })
        } else {
            console.log('test email');
            
            return res.status(409).json({
                "status": false,
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
export async function deleteUser(req, res) {1
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
    console.log('method profile');
    

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

