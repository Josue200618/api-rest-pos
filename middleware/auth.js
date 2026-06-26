const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');

const verificarToken = (req, res, next) => {

    let token = req.headers['authorization'];

    if (!token) {

        return res.status(401).json({
            message: 'Es necesario un token de autenticación'
        });

    }

    // Eliminar la palabra Bearer
    if (token.startsWith('Bearer ')) {

        token = token.slice(7);

    }

    jwt.verify(token, keys.key, (error, decoded) => {

        if (error) {

            return res.status(401).json({
                message: 'El token no es válido'
            });

        }

        req.usuario = decoded;

        next();

    });

};

module.exports = verificarToken;