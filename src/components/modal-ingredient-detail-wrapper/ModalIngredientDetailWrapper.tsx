import { useNavigate } from 'react-router-dom';
import { Modal, IngredientDetails } from '@components';

export const ModalIngredientDetailWrapper = () => {
  const navigate = useNavigate();

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <Modal title='Детали заказа' onClose={handleModalClose}>
      <IngredientDetails />
    </Modal>
  );
};
