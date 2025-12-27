import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';
import {
  selectOrders,
  fetchOrders,
  selectLoadingAllOrders
} from '../../services/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders) ?? [];
  const isLoading = useSelector(selectLoadingAllOrders);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchOrders());
  }, [dispatch, fetchOrders]);

  return <>{isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />}</>;
};
