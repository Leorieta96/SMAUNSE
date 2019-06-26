const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const posibles_valores = ["M", "F"];
const email_match = [/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, "coloca un email valido"];
const password_validation = {
	validator:function(p){
		return this.password_confirmation == p;
	},
	message:"Las contraseñas no son iguales"
};

mongoose.connect("mongodb://127.0.0.1:27017/smaunse_user",{ useNewUrlParser: true });

var user_schema = new Schema({
    dni: {type: Number, required: true, useCreateIndex: true},
    nombreApellido: {type: String, required:true},
    nAfiliado: {type: Number, required: true, default:000},
    telefono: {type: Number, required:true},
    correo: {type: String, required: "El correo es obligatorio", match: email_match},
    password: {
		type: String,
		required: true,
		minlength: [8, "password muy corto"],
        //validate:password_validation
        },
    admin: {type: Boolean, default: false}
    });
user_schema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(password){
    this.p_c = password;
});

var User = mongoose.model("User", user_schema);

module.exports.User = User;