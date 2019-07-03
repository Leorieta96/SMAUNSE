const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const User = require("./models/user").User;
const session = require("express-session");
var cookieParser = require('cookie-parser');
const session_middleware = require("./middleware/session.js");
const RedisStore = require("connect-redis")(session);
const http = require("http");
const flash =  require('connect-flash');
var fileUpload = require('express-fileupload');
const Articulo = require("./models/articulos").Articulo;
const Servicio = require("./models/servicio").Servicio;
const Rubro = require("./models/rubro").Rubro;
const Marca = require("./models/marca").Marca;
const ordenar = require("./middleware/function");

var methodOverride = require("method-override");

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({
    store: new RedisStore({}),
	secret: "123byuhbsdah12ub",
	resave: false,//la sesion se vuelve a guardar aunque no haya sido modificada
	saveUninitialized: false,
});

app.use(express.static('public'));

app.use(bodyParser.json());//para peteciones json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(sessionMiddleware);
app.use(cookieParser())
app.use(fileUpload());

app.use(flash());
app.use(function(req, res, next){
	app.locals.messageLogin = req.flash("login");
	app.locals.messageSignup = req.flash("signup");
	app.locals.messageServicio = req.flash("serv");
	app.locals.messageMarca = req.flash("marca");
	var title = req.flash("title");
	app.locals.messageAdmin = title == 0 ? app.locals.messageAdmin :  title;
	var href = req.flash("href");
	app.locals.hrefAdmin = href == 0 ? app.locals.hrefAdmin :  href;
	app.locals.UserName = req.session.name;
	next();
   });


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "jade");

app.get("/", async(req,res)=>{
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
	
	Articulo.find({}).exec((err, items)=>{
		if(!err){
			res.render("index", {
				id: req.session.user_id,
				userAdmin: req.session.userAdmin,
				name: req.session.name,
				items: items,
				servicios: servicios,
				rubros: rubros,
				marcas: marcas});
		}else{
			console.log(err);
		}
	});
});

app.use("/admin/", session_middleware.Login); //para soicitar que este loqueado
app.use(require("./route_usuarios"));
app.use(require("./route_articulos"));
app.use(require("./route_rubro"));
app.use(require("./route_servicio"));
app.use(require("./route_marca"));


server.listen(8080)