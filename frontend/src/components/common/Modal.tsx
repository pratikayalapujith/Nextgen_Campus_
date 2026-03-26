import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-heading font-bold text-lg text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-all duration-200 text-muted-foreground hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
