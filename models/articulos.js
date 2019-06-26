const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/smaunse_user",{ useNewUrlParser: true });

var articulos_schema = new Schema({
    descripcion: {type: String, required: true},
    descripcionCorta: {type: String, required: true, maxlength: 30},
    precioUnitario:{type: Number, required: true},
    stock: {type: Number, required: true},
    stockMinimo: {type: Number, required: true},
    fechaAlta: {type: Date,  default: Date.now},
    fechaBaja: {type: Date,  default: Date.now},
    marca: {type: Schema.Types.ObjectId, ref: "Marca"}, // {type: Schema.Types.ObjectId, ref: "User"}
    rubro:{type: Schema.Types.ObjectId, ref: "Rubro"},
    extension:{type: String, required: true}
});

articulos_schema.index({
    descripcion: 'text',
    descripcionCorta: 'text',
});

var Articulo = mongoose.model("Articulo", articulos_schema);

module.exports.Articulo = Articulo;