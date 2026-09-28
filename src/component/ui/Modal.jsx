import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
