const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/smaunse_user",{ useNewUrlParser: true });

var rubros_schema = new Schema({
    descripcion: {type: String, required: true},
    fechaAlta: {type: Date,  default: Date.now},
    fechaBaja: {type: Date,  default: Date.now},
    servicio: {type: Schema.Types.ObjectId, ref: "Servicio"}
});

rubros_schema.index({
    descripcion: 'text'
});
var Rubro = mongoose.model("Rubro", rubros_schema);

module.exports.Rubro = Rubro;