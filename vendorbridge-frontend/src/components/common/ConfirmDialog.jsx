import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  isDanger = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-lg">
        <p className="text-body-md text-on-surface-variant">{message}</p>
        <div className="flex justify-end gap-md">
          <button
            onClick={onClose}
            className="px-lg py-sm border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-lg py-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all text-white ${
              isDanger 
                ? 'bg-error shadow-[0_2px_0_0_rgba(186,26,26,0.5)]' 
                : 'bg-primary text-on-primary shadow-[0_2px_0_0_rgba(116,91,0,0.5)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
