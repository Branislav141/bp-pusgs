import React from "react";
import ModalModuleCSS from "./Modal.module.css"; // Import your Modal CSS module

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode;
}

const CardModal: React.FC<ModalProps> = ({ closeModal, children }) => {
  return (
    <div className={ModalModuleCSS.modalOverlay}>
      <div className={ModalModuleCSS.modalContent}>
        <button className={ModalModuleCSS.closeButton} onClick={closeModal}>
          Close
        </button>
        <div>Description</div>
        <div className={ModalModuleCSS.modalDescription}>{children}</div>
      </div>
    </div>
  );
};

export default CardModal;
