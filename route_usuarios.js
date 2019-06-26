const express = require('express');
var router = express.Router();
const User = require("./models/user").User;

router.get("/signup", (req, res)=>{
    res.render("signup");
});

router.post("/add-user", (req, res)=>{
    b = true;
    if(req.body.dni == ""){
        req.flash("signup", "Ingrese DNI")
        b = false
    }else if(isNaN(req.body.dni)){
        req.flash("signup", "Ingrese solo números DNI")
        b = false;
    }
    if(req.body.nombreApellido == ""){
        req.flash("signup", "Ingrese Nombre y Apellido")
        b = false
    }else if (!isNaN(req.body.nombreApellido)){
        req.flash("signup", "Ingrese solo letras")
        b = false;
    }
    if(req.body.nAfiliado == ""){
        req.flash("signup", "Ingrese Número de Afiliado")
        b = false
    }else if (isNaN(req.body.nAfiliado)){
        req.flash("signup", "Ingrese solo numeros")
        b = false;
    }
    if(req.body.telefono == ""){
        req.flash("signup", "Ingrese Número de Telefono")
        b = false
    }else if (isNaN(req.body.telefono)){
        req.flash("signup", "Ingrese solo números")
        b = false;
    }
    if(req.body.correo == ""){
        req.flash("signup", "Ingrese Correo")
        b = false
    }
    if(req.body.password == ""){
        req.flash("signup", "Ingrese Contraseña")
        b = false
    }else if(req.body.password.length < 8){
        req.flash("signup", "Ingrese Contraseña con más de 7 caracteres")
        b = false
    }
    if(b){
        const user = new User(req.body);
        User.findOne({dni: user.dni},"", function(err,us){
            if(us == null){
                user.save().then((us)=>{
                    console.log("Guardado" + user);
                    res.redirect("/login");
                }, (err)=>{
                    console.log(err);
                });
            }else{
                req.flash("signup", "ya existe un usuario con es DNI")
                console.log("Existe usuario " + us);
                res.redirect("/signup");
            }
        });
    }else{
        res.redirect("/signup");
    }
});

router.get("/login", (req, res)=>{
    if(!req.session.user_id){
        res.render("login");
    }else{
        res.redirect("/");
    }
});

router.post("/login", (req, res)=>{
    b = true;
    if(req.body.dni == ""){
        req.flash("login", "Ingrese DNI");
        b = false;
    }else if(isNaN(req.body.dni)){
        req.flash("login", "Ingrese solo números");
        b = false;
    }
    if(req.body.password == ""){
        req.flash("login", "Ingrese contraseña");
        b = false;
    }
    if(b){
        User.findOne({dni: req.body.dni, password: req.body.password},"", function(err,user){
            if(user != null){
                req.session.user_id = user._id; // levantar servidor redis para que tome req.session
                req.session.userAdmin = user.admin;
                req.session.name = user.nombreApellido;
                console.log("\tLogin\n\tIngreso usuario: " + user._id);
                res.redirect("/");
                //res.render("index", {session: req.session});
            }else{
                req.flash('login', 'DNI o Contraseña incorrecta');
                res.redirect('/login');
            }
        });
    }else{
        res.redirect('/login');
    }
});

router.get("/logout", (req, res)=>{
    req.session.destroy((err)=>{
        //res.render("index", {session: req.session});
        if(!err){
            res.redirect("/");
        }else{
            console.log(err);
        }
    });
});

module.exports = router;