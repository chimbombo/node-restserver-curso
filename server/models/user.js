    const mongoose = require('mongoose');
    const uniqueValidator = require('mongoose-unique-validator')

    let rolesValidos = {
        values: ['ADMIN_ROLES', 'USER_ROLE'],
        message: '{VALUE} no es un rol valido'
    }
    let Schema = mongoose.Schema;

    let usuarioSchema = new Schema({
        name: { type: String, required: [true, 'El nombre es necesario'] },
        email: { type: String, required: [true, 'El correo es necesario'], unique: true },
        password: { type: String, required: [true, 'La contraseña es obligatoria'] },
        img: { type: String, required: false },
        role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
        status: { type: Boolean, default: true },
        google: { type: Boolean, default: false }
    })

    usuarioSchema.methods.toJSON = function() {
        let usuario = this;
        let userObject = usuario.toObject()
        delete userObject.password;

        return userObject
    }

    usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

    module.exports = mongoose.model('user', usuarioSchema)