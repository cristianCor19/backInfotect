import User from '../models/user.js'
import { genSalt, hash, compare } from 'bcrypt'
import { createAccessToken } from '../libs/jwt.js'
import jwt from 'jsonwebtoken'
import { createTransport } from 'nodemailer'



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
export async function loginUser(req, res) {
    try {
        console.log('entro a login');
        const { email, password } = req.body
        const userFound = await User.findOne({ email: email })
        // console.log(User)
        if (!userFound) {
            return res.status(404).json({
                "status": false,
                "message": "Usuario no encontrado"
            })
        }

        const passwordMatch = await compare(password, userFound.password)
        if (!passwordMatch) {
            return res.status(401).json({
                "status": false,
                "message": "Contraseña incorrecta"
            })
        }

        //asignar el role

        const role = userFound.role


        const token = await createAccessToken({
            id: userFound._id, role: userFound.role
        })

        return res.status(200).json({
            "status": true,
            "data": userFound,
            "role": role,
            "message": "Inicio de sesión exitoso",
            "token": token
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error
        })
    }
}

export async function verifyToken(req, res) {
    // console.log('entro a verificar por recarga');
    const token = req.params.token

    if (!token) return res.status(401).json({
        message: 'No existe autorizacion'
    })

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({
            message: 'No existe autorizacion'
        })

        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({
            message: 'No existe autorizacion'
        })

        
        return res.json({
            id: userFound._id,
            name: userFound.name,
            lastname: userFound.lastname,
            email: userFound.email
        })
    })
}

export async function verifyUser(req, res) {
    // console.log('hola buenas noches mi nombre es rosell');
    try {
        // const  {token } = req.body
        const token = req.params.token
        // console.log(token);
        const decoded = jwt.decode(token);
        const role = decoded.role
        console.log(role);

        return res.status(200).json({
            role: role
        })
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }


}

function obtenerFechaYHoraActual() {
    // Lógica para obtener la fecha y hora actual
    // Puedes usar la biblioteca Date de JavaScript o algún paquete de manejo de fechas
    const fecha = new Date();
    return fecha.toLocaleString(); // Ajusta el formato según tus preferencias
}

export async function sendMailRecoveryPass(req, res) {
    const { email } = req.body
    const fechaYHora = obtenerFechaYHoraActual();
    const userFound = await User.findOne({ email: email })


    if (userFound) {
        const transporter = createTransport({
            service: 'Gmail',
            auth: {
                user: 'remainsystem32@gmail.com',
                pass: 'ohgw qzed pyzt bppq'
            }
        })

        const mailOptions = {
            from: 'remainsystem32@gmail.com',
            to: email,
            subject: 'Recuperación de Contraseña - Acción Detectada',
            text: `
            Estimado/a ${userFound.name} ${userFound.lastname},
        
            Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta de correo ${userFound.email} en Infotect Solutions. Si no has solicitado este cambio, por favor ignora este correo electrónico.
        
            Detalles de la Solicitud:
              - Dispositivo: [Nombre del Dispositivo]
              - Ubicación: [Ubicación Aproximada]
              - Fecha y Hora: [${fechaYHora}]
        
            Si has solicitado el cambio de contraseña, por favor haz clic en el siguiente enlace para proceder con la recuperación de tu cuenta:
        
            https://frontend-client-wine.vercel.app/updatePasswordRecovery/${userFound._id}
        
            Este enlace es válido por un tiempo limitado por razones de seguridad. Si no completas la recuperación en el plazo especificado, deberás iniciar el proceso nuevamente.
        
            Gracias por utilizar Infotect Solutions.
        
            Atentamente,
            Infotect Solutions
            `
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error al enviar el correo electronico', error)
                return res.status(200).json({ "state": false, "message": error })
            } else {
                console.log('Correo electronico enviado con exito', info.response)
                return res.status(200).json({
                    name: userFound.name,
                    lastname: userFound.lastname,
                    email: userFound.email,
                    "state": true,
                    "message": "funciono"
                })
            }
        })
    } else {
        return res.status(404).json({
            "state": false,
            "message": "No se encontro el correo"
        })
    }
}




export async function updatePasswordRecovery(req, res) {
    const { id, password, confirmPassword } = req.body
    console.log(password);
    console.log(confirmPassword);

    if(password !== confirmPassword) {
        return res.status(401).json({
            "status": false,
            "message": "Las contraseñas no coinciden"
        })
    }

    const salt = await genSalt(10)
    const newHashedPassword = await hash(password, salt)

    try {
        const updateUser = await User.findByIdAndUpdate(
            id, 
            { password: newHashedPassword },
            { new: true }
        );

        if (updateUser) {
            return res.status(200).json({
                state: true, updateUser
            })
        } else {
            return res.status(500).json({
                state: false,
                message: "Usuario no encontrado"
            })
        }
    } catch (error) {
        return res.status(500).json({
            state: false,
            message: error.message
        })
    }
}

export function logout(req, res) {
    console.log('entro logout');
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    })

    return res.sendStatus(200)
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

