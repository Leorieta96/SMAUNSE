const express = require('express');
var router = express.Router();
const Marca = require("./models/marca").Marca;


router.get("/admin/marcas", (req, res)=>{
    Marca.find({}, (err, marcas)=>{
        res.render("marca/marca", {
            marcas: marcas,
            id: req.session.user_id,
            userAdmin: req.session.userAdmin,
            name: req.session.name,
            href: "marcas"});
    })
});

router.get("/admin/marcas/add-marcas", (req, res)=>{
    res.render("marca/add-marca", {
        id: req.session.user_id,
        userAdmin: req.session.userAdmin,
        name: req.session.name});
});

router.post("/admin/marcas/add-marca", (req, res)=>{
    b = true;
    if(req.body.descripcion == ""){
        req.flash('marca', "Ingrese descripcion")
        b = false;
    }
    if(b){
        var data = {
            descripcion: req.body.descripcion,
        };
        Marca.findOne({descripcion: req.body.descripcion}, (err, m)=>{
            if(m == 0){
                const marca = new Marca(data);
                marca.save((err)=>{
                    if(!err){
                        res.redirect("/admin/marcas");
                    }else{
                        req.flash('marca', "Error al guardar " + err);
                        res.redirect("/admin/marcas/add-marcas");
                    }
                });
            }else{
                req.flash('marca', "Ya existe Marca");
                res.redirect("/admin/marcas/add-marcas");
            }
        })
    }else{
        res.redirect("/admin/marcas/add-marcas");
    }
});

router.post("/admin/marcas/search-marcas", (req,res)=>{
    Marca.find({
        $text:
        {$search: req.body.search,
        $caseSensitive: false,
        $diacriticSensitive: false}
    }).exec((err,marcas)=>{
            if(!err){
                //console.log(marcas);
                res.render("marca/marca", {
                    marcas: marcas,
                    id: req.session.user_id,
                    userAdmin: req.session.userAdmin,
                    name: req.session.name,
                    href: "marcas"});
            }else{
                res.send(err);
            }
        });
});

router.route("/admin/marcas/:id")
    .get((req,res)=>{
        res.render("paginaConst");
    })
    .put((req,res)=>{
        res.render("paginaConst");
    })
    .delete((req,res)=>{
        Marca.findByIdAndDelete(req.params.id, (err, marca)=>{
            if(!err){
                res.redirect("/admin/marcas")
            }
        });
    });

module.exports = router;