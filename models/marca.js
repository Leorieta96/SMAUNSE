const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/smaunse_user",{ useNewUrlParser: true });

var marca_schema = new Schema({
    descripcion: {type: String, required: true},
});

marca_schema.index({
    descripcion: 'text'
});

var Marca = mongoose.model("Marca", marca_schema);

module.exports.Marca = Marca;