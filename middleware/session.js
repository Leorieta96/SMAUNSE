var User = require("../models/user").User;

module.exports.Login = function(req, res, next){
    if(!req.session.user_id){
        res.redirect("/login");
    }else{
        User.findById(req.session.user_id, function(err, user){
            if(err){
                console.log(err);
                res.redirect("/login");
            }else{
                if(user.admin){
                    res.locals = {user: user};
                    next();
                }else{
                    res.redirect("/login");
                }
            }
        });
    }
}
