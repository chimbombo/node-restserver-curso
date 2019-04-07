const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = decoded.user;
        next();
    })

}

let verificaAdmin = (req, res, next) => {
    let user = req.user;

    if (user.role != 'ADMIN_ROLE') {
        return res.status(404).json({
            ok: false,
            err: 'El User no es ADMIN_ROLE'
        })
    }
    next()
}
module.exports = { verificaToken, verificaAdmin }