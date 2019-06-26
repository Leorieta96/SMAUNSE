const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/smaunse_user",{ useNewUrlParser: true });

var servicio_schema = new Schema({
    descripcion: {type: String, required: true},
});

servicio_schema.index({
    descripcion: 'text'
});

var Servicio = mongoose.model("Servicio", servicio_schema);

module.exports.Servicio = Servicio;