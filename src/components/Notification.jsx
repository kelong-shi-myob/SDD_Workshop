export default function Notification({ message, type = 'success', onClose }) {
  if (!message) return null;

  const styles = {
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: 'var(--pico-border-radius)',
    backgroundColor: type === 'error' ? 'var(--pico-color-red-100)' : 'var(--pico-color-green-100)',
    color: type === 'error' ? 'var(--pico-color-red-900)' : 'var(--pico-color-green-900)',
    border: `1px solid ${type === 'error' ? 'var(--pico-color-red-200)' : 'var(--pico-color-green-200)'}`
  };

  return (
    <div style={styles}>
      <div className="grid" style={{ gridTemplateColumns: '1fr auto' }}>
        <span>{message}</span>
        {onClose && (
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} style={{ color: 'inherit', textDecoration: 'none' }}>
            ✕
          </a>
        )}
      </div>
    </div>
  );
}

