const express = require('express');
var router = express.Router();
const ordenar = require("./middleware/function");
const Articulo = require("./models/articulos").Articulo;
const Servicio = require("./models/servicio").Servicio;
const Rubro = require("./models/rubro").Rubro;
const Marca = require("./models/marca").Marca;


router.get("/admin/add-item", async (req, res)=>{
    var marcas;
    await Marca.find({}, (err,m)=>{
        marcas = m;
    });
    Rubro.find({}).exec((err, rubros)=>{
        res.render("item/add-item",{
            id: req.session.user_id,
            userAdmin: req.session.userAdmin,
            name: req.session.name,
            rubros: rubros,
            marcas: marcas});
        })
});

router.post("/admin/add-item", async (req, res)=>{
    var marca;
    await Marca.findOne({descripcion: req.body.marca}, (err,m)=>{
        marca = m;
    });
    Rubro.findOne({descripcion: req.body.rubro}, "", (err, rubro)=>{
        var extension = req.files.archivo.name.split(".").pop();
        var data = {
            descripcion: req.body.descripcion,
            descripcionCorta: req.body.descripcionCorta.substr(0,14),
            precioUnitario: req.body.precioUnitario,
            stock: req.body.stock,
            stockMinimo: req.body.stockMinimo,
            marca: marca._id,
            rubro: rubro._id,
            extension: extension
        };
        const item = new Articulo(data);
        item.save((err)=>{
            if(!err){
                req.files.archivo.mv("public/imagenes/"+item._id+"."+extension , function(err) {
                    if (err)
                        return res.status(500).send(err);
                    });
                res.redirect("/");
            }else{
                res.render(err);
            }
        });
    });
});

router.post("/search-articulos", async(req,res)=>{
    var servicios;
	var rubros;
	var marcas;
	await Servicio.find({}, "descripcion", (err,serv) =>{
		servicios = serv;
	});

    await Rubro.find({})
                .populate("servicio")
                .exec((err,rub) =>{
                    rubros = rub;
                    console.log(rubros);
	            });

	await Marca.find({}, "", (err,marc) =>{
		marcas = marc;
	});
    var search = req.body.search;
    Articulo.find({
        $text:
            {$search: search,
            $caseSensitive: false,
            $diacriticSensitive: false}
        })  .populate({path:"rubro"})
            .populate("marca")
            .exec((err,articulos)=>{
            if(!err){
                console.log(articulos);
                res.render("index", {
                    id: req.session.user_id,
                    userAdmin: req.session.userAdmin,
                    name: req.session.name,
                    items: articulos,
                    servicios: servicios,
                    rubros: rubros,
                    marcas: marcas,
                    search: search});
            }else{
                res.send(err);
            }
        });
});

router.post("/search-articulos-filtros", async(req,res)=>{
    var servicios;
	var rubros;
    var marcas;
    var rub = req.body.rubro;
    var idMarca = req.body.marca == 'Marca'? undefined : req.body.marca;
    var montoMin = req.body.montoMin == ""? 0 : req.body.montoMin;
    var montoMax = req.body.montoMax == ""? 1000000 : req.body.montoMax;
    var idRubro;
    var i;


    await Servicio.find({}, "descripcion", (err,serv) =>{
		servicios = serv;
    });

    await Rubro.find({})
                .populate("servicio")
                .exec((err,rub) =>{
                    rubros = rub;
	            });

	await Marca.find({}, "", (err,marc) =>{
		marcas = marc;
    });
    
    for(i = 0; i < rub.length; i++){
        if(rub[i] != 'Rubro'){
            idRubro = rub[i];
        }
    }

    if(idRubro != undefined){
        if(idMarca != undefined){
            Articulo.find({
                $text:{
                    $search: req.body.articulo,
                    $caseSensitive: false,
                    $diacriticSensitive: false},
                rubro: idRubro,
                marca: idMarca,
                $and:[
                    {precioUnitario:{$gte:montoMin}},
                    {precioUnitario:{$lte:montoMax}}]
                })
                .exec((err,articulos)=>{
                    if(!err){
                        res.render("index", {
                            id: req.session.user_id,
                            userAdmin: req.session.userAdmin,
                            name: req.session.name,
                            items: articulos,
                            servicios: servicios,
                            rubros: rubros,
                            marcas: marcas,
                            search: req.body.articulo});
                    }else{
                        res.send(err);
                    }
                });
        }else{
            Articulo.find({
                $text:{
                    $search: req.body.articulo,
                    $caseSensitive: false,
                    $diacriticSensitive: false},
                rubro: idRubro,
                $and:[
                    {precioUnitario:{$gte:montoMin}},
                    {precioUnitario:{$lte:montoMax}}]
                })
                .exec((err,articulos)=>{
                    console.log("todo menos marca")
                    if(!err){
                        res.render("index", {
                            id: req.session.user_id,
                            userAdmin: req.session.userAdmin,
                            name: req.session.name,
                            items: articulos,
                            servicios: servicios,
                            rubros: rubros,
                            marcas: marcas,
                            search: req.body.articulo});
                    }else{
                        res.send(err);
                    }
                });
        }
    }else if(idMarca != undefined){
        Articulo.find({
            $text:{
                $search: req.body.articulo,
                $caseSensitive: false,
                $diacriticSensitive: false},
            marca: idMarca,
            $and:[
                {precioUnitario:{$gte:montoMin}},
                {precioUnitario:{$lte:montoMax}}]
            })
            .exec((err,articulos)=>{
                if(!err){
                    console.log("solo marca")
                    res.render("index", {
                        id: req.session.user_id,
                        userAdmin: req.session.userAdmin,
                        name: req.session.name,
                        items: articulos,
                        servicios: servicios,
                        rubros: rubros,
                        marcas: marcas,
                        search: req.body.articulo});
                }else{
                    res.send(err);
                }
            });
    }else{
        Articulo.find({
            $text:{
                $search: req.body.articulo,
                $caseSensitive: false,
                $diacriticSensitive: false},
                $and:[
                    {precioUnitario:{$gte:montoMin}},
                    {precioUnitario:{$lte:montoMax}}]
            })
            .exec((err,articulos)=>{
                if(!err){
                    console.log("nada")
                    res.render("index", {
                        id: req.session.user_id,
                        userAdmin: req.session.userAdmin,
                        name: req.session.name,
                        items: articulos,
                        servicios: servicios,
                        rubros: rubros,
                        marcas: marcas,
                        search: req.body.articulo});
                }else{
                    res.send(err);
                }
            });
    }
});

module.exports = router;