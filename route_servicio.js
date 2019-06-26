const express = require('express');
var router = express.Router();
const Servicio = require("./models/servicio").Servicio;

router.get("/admin/servicios", (req, res)=>{
    Servicio.find({}, (err, servicios)=>{
        res.render("servicio/servicio", {
            servicios: servicios,
            id: req.session.user_id,
            userAdmin: req.session.userAdmin,
            name: req.session.name,
            href: "servicios"});
    })
});

router.get("/admin/servicios/add-servicios", (req, res)=>{
    res.render("servicio/add-servicio", {id: req.session.user_id,
                userAdmin: req.session.userAdmin, name: req.session.name});
});

router.post("/admin/servicios/add-servicio", (req, res)=>{
    b = true;
    if(req.body.descripcion == ""){
        req.flash('serv', 'Ingrese descripcion');
        b = false;
    }
    if(b){
        var data = {
            descripcion: req.body.descripcion,
        };
        const servicio = new Servicio(data);
        servicio.save((err)=>{
            if(!err){
                res.redirect("/admin/servicios"); // ir a servicio
            }else{
                res.send(err); // ir a servicio
            }
        });
    }else{
        res.redirect("/admin/servicios/add-servicio");
    }
});

router.post("/admin/servicios/search-servicios", (req,res)=>{
    //Servicio.find({descripcion: { $regex: req.body.search.substring(1)}})
    Servicio.find(
        {$text:
            {$search: req.body.search,
            $caseSensitive: false,
            $diacriticSensitive: false}
        }).exec((err,servicios)=>{
                if(!err){
                    //console.log(servicios);
                    res.render("servicio/servicio", {
                        servicios: servicios,
                        id: req.session.user_id,
                        userAdmin: req.session.userAdmin,
                        name: req.session.name,
                        href: "servicios"});
                }else{
                    res.send(err);
                }
            });
});
router.route("/admin/servicios/:id")
    .get((req,res)=>{
        res.render("paginaConst");
    })
    .put((req,res)=>{
        res.render("paginaConst");
    })
    .delete((req,res)=>{
        res.render("paginaConst");
    });

module.exports = router;