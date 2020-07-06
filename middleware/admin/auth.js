const jwt = require('jsonwebtoken')

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');
    // Check if not token
    if(!token) {
        return res.status(401).json({
            msg: 'No token, authorizartion denied'
        });
    }

    // Verify token
    try {

        await jwt.verify(token, process.env.jwtAdminSecret, (error, decoded) => {
            if(error) {
                res.status(401).json({
                    msg: 'Token is not valid'
                });
            } else {
                req.admin = decoded.admin;
                next();
            }
        })
    } catch(error) {
        console.error('something wrong with auth middleware')
        res.status(500).json({
            msg: 'Server Error'
        });
    }
}