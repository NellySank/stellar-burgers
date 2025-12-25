import { useNavigate, useParams } from 'react-router-dom';
import { Modal, OrderInfo } from '@components';

export const ModalOrderInfoWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={`#${id}`} onClose={handleModalClose}>
      <OrderInfo />
    </Modal>
  );
};
