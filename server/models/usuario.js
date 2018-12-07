/**
 * 
 * 
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] //con las llaves cuadradas metemos un comentario en español
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    }, //no es obligatoria
    role: {
        type: String,
        reguired: false,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //default: 'USER_ROLE '
    estado: {
        type: Boolean,
        default: true
    }, //Boolean
    google: {
        type: Boolean,
        default: false
    } //Boolean

});

//con esto quitamos el campo password a la hora de imprimirlo. No usar funcion de flecha, ya que se necesita this
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password; // con esto hemos modificado el toJSON para que cuando lo imprima no lo muestre. Pero el campo no se ha  borrado realmente

    return userObject;

}


usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

//El modelo se llama Usuario y tendrá la configuración de usuarioSchema

module.exports = mongoose.model('Usuario', usuarioSchema);