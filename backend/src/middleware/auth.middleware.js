export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenEsperado = process.env.AUTH_TOKEN || 'grupo3-token-secreto';

  if (!authHeader) {
    return res.status(401).json({
      mensagem: 'Token não enviado. Use o header Authorization: Bearer <token>.'
    });
  }

  const [tipo, tokenRecebido] = authHeader.split(' ');

  if (tipo !== 'Bearer' || !tokenRecebido) {
    return res.status(401).json({
      mensagem: 'Formato inválido. Use Authorization: Bearer <token>.'
    });
  }

  if (tokenRecebido !== tokenEsperado) {
    return res.status(401).json({
      mensagem: 'Token inválido.'
    });
  }

  next();
}
