export default function AlertBox({ type = 'info', children, onClose }) {
  if (!children) return null;

  return (
    <div className={`alert-box alert-${type}`} role="alert">
      <span>{children}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
