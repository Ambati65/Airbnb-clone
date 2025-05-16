const User=require('../models/user.js');


module.exports.renderSignup=(req,res)=>{
    res.render('users/signup.ejs');
}

module.exports.signup=async(req,res)=>{
    try{
    let {email,username,password}=req.body;
    const newUser=new User({email,username});
    let regUser=await User.register(newUser,password);
    console.log(regUser);
    req.login(regUser,(err)=>{
        if(err){
           return next(err);
        }
         req.flash("success", "welcome to TravelMedia!");
         res.redirect('/listings');
    });
    }catch(e){
        req.flash("error", e.message);
        res.redirect('/signup');
    }
};

module.exports.login=async(req,res)=>{
    req.flash("success", "welcome back TravelMedia!");
    let redirectUrl=res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((e)=>{
        if(e){
            next(e);
        }
        req.flash('success','your successfully logout');
        res.redirect('/login');
    })
};