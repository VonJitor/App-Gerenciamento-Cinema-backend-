// Middleware de autenticacao
// Verifica se o JWT no cookie eh valido

const jwt = require('jsonwebtoken');
const config = require('../../config.js');

// Middleware que protege rotas
const authMiddleware = (req, res, next) => {
    // Pega o token do cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'Acesso negado. Token nao fornecido.',
        });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Anexa dados do usuario no request
        req.usuario = {
            id: decoded.id,
            email: decoded.email,
            nome: decoded.nome,
        };

        next(); // continua para a proxima funcao
    } catch (error) {
        // Token invalido ou expirado
        return res.status(401).json({
            message: 'Token invalido ou expirado.',
        });
    }
};

module.exports = authMiddleware;
