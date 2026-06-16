function Message({ message }) {
  if (!message) return null;

  return (
    <div className={`message ${message.tipo}`}>
      {message.texto}
    </div>
  );
}

export default Message;
