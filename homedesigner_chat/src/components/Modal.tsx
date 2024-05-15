import React from 'react';
import './../css/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const closeModal = () => {
    onClose();
  }

  const openInOnlineMarketplace = () => {

  }

  const openInThreed = () => {

  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="modal-header">
          <h1>{title}</h1>
          <button onClick={() => closeModal()} className="close-button">✖</button>
        </header>
        {
            children &&       
            <div className="modal-content">
            {children}
            </div>
        }
        <footer className="modal-footer">
          {/* <button className='modal-option-button' onClick={() => openInOnlineMarketplace()}>Open in 3D-view at home</button> */}
          <a href={`/threedroute/?id=table`}>
            <div className='modal-option-button'>Open in 3D-view at home</div>
          </a>
          <button className='modal-option-button' onClick={() => openInOnlineMarketplace()}>Open in online marketplace</button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
