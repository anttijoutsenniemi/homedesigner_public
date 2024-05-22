import React from 'react';
import './../css/Modal.css';
import { FurnitureData } from '../App';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: string
  singleProduct: any
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, singleProduct }) => {
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
          {/* <button className='modal-option-button' onClick={() => openInOnlineMarketplace()}>Open in online store</button> */}
          <a href={`${singleProduct.productUrl}`}>
            <div className='modal-option-button'>Open in online store</div>
          </a>
          <a href={`/threedroute/?id=${singleProduct.title}`}>
            <div className='modal-option-button'>Open in 3D-view at home</div>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
