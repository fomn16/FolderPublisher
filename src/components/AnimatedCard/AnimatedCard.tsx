import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import './AnimatedCard.css';
import { MdClose } from 'react-icons/md';
import { ActiveModal, useAppStateStore } from '../../stores';

Modal.setAppElement('#root');

interface Props{
    type: ActiveModal
    children: ReactNode
}

const AnimatedCard = (props: Props) => {
  const { type, children } = props
  const { closeModal, activeModal} = useAppStateStore()
  const isOpen = activeModal === type
  return (
    <AnimatePresence>
    {isOpen && (
        <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="animated-modal-content"
        overlayClassName="animated-modal-overlay"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        >
        <motion.div
            className="card-content"
            initial={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                opacity: 0,
                borderRadius: '8px',
                translateX: '-50%',
                translateY: '100%',
            }}
            animate={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                opacity: 1,
                borderRadius: '8px',
                translateX: '-50%',
                translateY: '-50%',
            }}
            exit={{ 
                opacity: 0,
                translateY: '100%',
            }}
            transition={{ duration: 0.2 }}
            >
        <button className='icon-button top-right' onClick={closeModal}><MdClose/></button>
        {children}
        </motion.div>
        </Modal>
    )}
    </AnimatePresence>
  );
};

export default AnimatedCard;