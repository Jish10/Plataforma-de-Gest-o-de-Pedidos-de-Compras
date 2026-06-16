export function createHttpError(status, mensagem) {
  const error = new Error(mensagem);
  error.status = status;
  return error;
}
