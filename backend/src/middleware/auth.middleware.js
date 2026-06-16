const TOKEN_VALIDO = 'meu-token-secreto-2025';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido ou inválido.' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== TOKEN_VALIDO) {
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }

  next();
}

module.exports = authMiddleware;
