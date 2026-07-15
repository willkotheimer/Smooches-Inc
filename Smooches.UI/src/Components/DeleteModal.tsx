import { useState, type ReactNode } from 'react';
import Button from '../ui/Button';

interface DeleteModalProps {
  buttonLabel: ReactNode;
  className?: string;
  title: ReactNode;
  children?: ReactNode;
}

export default function DeleteModal({ buttonLabel, title, children }: DeleteModalProps) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  return (
    <>
      <Button variant="ghost" onClick={toggle}>
        {buttonLabel}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={toggle} aria-hidden />
          <div className="relative z-10 w-full max-w-md rounded-card border border-accent/60 bg-surface p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={toggle} aria-label="Close" className="text-muted hover:text-foreground">
                <i className="fa-solid fa-xmark" aria-hidden />
              </button>
            </div>
            <div className="text-sm">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
