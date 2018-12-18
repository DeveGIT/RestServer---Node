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


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la Categoría es necesario'], //con las llaves cuadradas metemos un comentario en español
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    }, //Boolean
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// saltará este error cuando se intente crear el mismo campo que ya existe en el bd con el propiedad "unique:true"
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

//El modelo se llama Categoria y tendrá la configuración de categoriaSchema

module.exports = mongoose.model('Categoria', categoriaSchema);