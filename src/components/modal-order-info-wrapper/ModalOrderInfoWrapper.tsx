import { useNavigate, useParams } from 'react-router-dom';
import { Modal, OrderInfo } from '@components';

export const ModalOrderInfoWrapper = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={`#${number}`} onClose={handleModalClose}>
      <OrderInfo />
    </Modal>
  );
};
