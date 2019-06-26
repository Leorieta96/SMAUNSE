const express = require('express');
var router = express.Router();
const Rubro = require("./models/rubro").Rubro;
const Servicio = require("./models/servicio").Servicio;


router.get("/admin/rubros", (req, res)=>{
    Rubro.find({})
        .populate("servicio")
        .exec((err, rubros)=>{
            if(!err){
                res.render("rubro/rubros", {
                    rubros: rubros,
                    id: req.session.user_id,
                    userAdmin: req.session.userAdmin,
                    name: req.session.name,
                    href: "rubros"});
            }else{
                console.log(err);
            }
        });
});

router.get("/admin/rubros/add-rubros", (req, res)=>{
    Servicio.find({}).exec((err, servicios)=>{
        if(!err){
            res.render("rubro/add-rubro", {
                servicios:servicios,
                id: req.session.user_id,
                userAdmin: req.session.userAdmin,
                name: req.session.name});
        }else{
            console.log(err);
        }
    });
});

router.post("/admin/rubros/add-rubro", (req, res)=>{
    b = true;
    if(req.body.descripcion == ""){
        req.flash('serv', 'Ingrese descripcion');
        b = false
    }else if(!isNaN(req.body.descripcion)){
        req.flash('serv', 'Ingrese descripcion');
        b = false
    }
    if(b){
        Rubro.find({descripcion: req.body.descripcion}, "", (err, rub)=>{
            if(rub == 0){
                Servicio.findOne({descripcion: req.body.servicio}, "", (err, serv)=>{
                    if(!err){
                        var data = {
                            descripcion: req.body.descripcion,
                            servicio: serv._id
                        };
                        const rubro = new Rubro(data);
                        rubro.save((err)=>{
                            if(!err){
                                res.redirect("/admin/rubros"); // ir a rubros
                            }else{
                                req.flash('serv', 'Error al guardar: ' + err);
                                res.redirect("/admin/rubros/add-rubro"); // ir a rubros
                            }
                        });
                    }else{
                        res.send(err);
                    }
                });
            }else{
                req.flash('serv', 'Ya existe esa marca');
                res.redirect("/admin/rubros/add-rubros");
            }
        });
    }else{
        res.redirect("/admin/rubros/add-rubros");
    }
});

router.post("/admin/rubros/search-rubros", (req,res)=>{
    Rubro.find({$text:
        {$search: req.body.search,
        $caseSensitive: false,
        $diacriticSensitive: false}
    }).populate("servicio")
        .exec((err,rubros)=>{
            if(!err){
                console.log(rubros);
                res.render("rubro/rubros", {
                    rubros: rubros,
                    id: req.session.user_id,
                    userAdmin: req.session.userAdmin,
                    name: req.session.name,
                    href: "rubros"});
            }else{
                res.send(err);
            }
        });
});

router.route("/admin/rubros/:id")
    .get((req,res)=>{
        Servicio.find({},(err,servicios)=>{
            Rubro.findOne({_id: req.params.id})
            .populate("servicio")
            .exec((err,rubro)=>{
            if(!err){
                console.log(rubro);
                res.render("rubro/edit-rubro",{rubro: rubro,
                    servicios: servicios,
                    id: req.session.user_id,
                    userAdmin: req.session.userAdmin,
                    name: req.session.name});
            }else{
                res.send(err);
            }
        });
        });
    })
    .put((req,res)=>{
        b = true;
        if(req.body.descripcion == ""){
            req.flash('serv', 'Ingrese descripcion');
            b = false
        }else if(!isNaN(req.body.descripcion)){
            req.flash('serv', 'Ingrese caracteres validos');
            b = false
        }
        if(b){
            var data = req.body;
            Servicio.findOne({descripcion: data.servicio},(err, serv)=>{
                if(!err){
                    Rubro.findByIdAndUpdate({_id: req.params.id},
                        {descripcion:data.descripcion, servicio: serv._id}, (err, rubro)=>{
                        if(!err){
                            console.log("Cambio guardados\n " + rubro);
                            res.redirect("/admin/rubros");
                        }
                    })
                }
            });
        }else{
            res.redirect("/admin/rubros/"+req.params.id);
        }
    })
    .delete((req,res)=>{
        Rubro.findByIdAndDelete(req.params.id,(err, rubro)=>{
            if(!err){
                res.redirect("/admin/rubros");
            }
        });
    });

module.exports = router;