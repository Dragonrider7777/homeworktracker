function Toast({ message, type = "success" }) {
  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      <div
        className="toast-content"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
}

export default Toast;
