//const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (!global.appName) {
        res.redirect('/');
        return;
    } else {
        // //We expected 'x-auth-token' from the client
        // const token = req.header("x-auth-token");
        // console.log("TOKEN FROM CLIENT :", token);
        // if (!token)
        //     return res.status(401).send({ error: "Access denied. No token provided." });

        // try {
        //     const payload = jwt.verify(token, "privateKey");
        //     req.user = payload;
        //     next();
        // } catch (err) {
        //     res.status(400).send({ error: "Invalid token." });
        // }
        console.log("VERIFY ACCESS TO THIS ROUTE : ", req.originalUrl);
        if (req.session.username) {
            console.log(req.session.UserData);
            next();
            console.log("User still authenticated...");
        } else {
            console.log("REDIRECT TO LOGIN PAGE");
            res.redirect('/');
        }

    }
};