export function login(req, res) {
  const { email, senha } = req.body;

  const emailEsperado = process.env.AUTH_EMAIL || 'admin@compras.cv';
  const senhaEsperada = process.env.AUTH_PASSWORD || '123456';
  const token = process.env.AUTH_TOKEN || 'grupo3-token-secreto';

  if (email !== emailEsperado || senha !== senhaEsperada) {
    return res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
  }

  res.json({
    mensagem: 'Login realizado com sucesso.',
    token
  });
}
