import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectConstructorItems,
  clearConstructor
} from '../../services/constructorSlice';
import {
  createOrder,
  selectOrderRequest,
  selectOrderModalData,
  closeOrderModal
} from '../../services/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/profileSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const constructorItems = useSelector(selectConstructorItems) ?? {
    bun: null,
    ingredients: []
  };

  const orderRequest = useSelector(selectOrderRequest) ?? false;

  const orderModalData = useSelector(selectOrderModalData);

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [dispatch, orderModalData]);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
    } else {
      if (!constructorItems.bun || orderRequest) return;

      const ingredientsIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];

      dispatch(createOrder(ingredientsIds));
    }
  };

  const closeOrderModalLocal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalLocal}
    />
  );
};
