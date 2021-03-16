function authenticateRoute(req, res, next) {
    var token = req.cookies["id"];
    var sign = config[env].signature;

    jwt.verify(token, sign, function (err, decoded) {
        if (err || !decoded) {
            console.log("invalid token");
            res.send(403);
        }
        else if (decoded && (!decoded.access || decoded.access == "unauthenticated")) {
            console.log("unauthenticated token");
            res.send(403);
        }
        else if (decoded && decoded.access == "authenticated") {
            console.log("valid token")
            next();
        }
        else {
            console.log("something suspicious")
            res.send(403);
        }
    });
};