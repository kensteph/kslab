const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport){
    const authenticatUser = (user_id,password,done)=>{
        const user = getInfouser(user_id);
        if(user == null){
            return done(null,false,{msg : "Not exists..."});
        }
        try {
            if( await bcrypt.compare(password,user.password)){

            }else{
                return done(null,false,{msg : "Mot de passe incorrect..."});
            }
        } catch (error) {
            return done(error);
        }
    }
passport.use(new localStrategy({usernameField : 'user_id'}),authenticatUser);
passport.serializeUser((user,done)=>{});
passport.deserializeUser((id,done)=>{});
}

module.exports=initialize;