import { useEffect } from 'react';
import './../css/Modal.css';
import { FurnitureData, Recommendation } from '../App';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: string
  products: any,
  product: Recommendation | any
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, products, product }) => {
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
          <a href={`${product.productUrl}`} target="_blank" rel="noopener noreferrer">
            <div className='modal-option-button'>Open in online store</div>
          </a>
          <a href={`/threedroute/?id=${product.title}`} target="_blank" rel="noopener noreferrer">
            <div className='modal-option-button'>Open in 3D-view at home</div>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
