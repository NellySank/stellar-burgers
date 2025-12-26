import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectLoadingAllOrders
} from '../../services/ordersSlice';
import { fetchIngredients } from '../../services/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeeds).orders;
  const loadingOrders = useSelector(selectLoadingAllOrders);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
  }, [dispatch, fetchIngredients, fetchFeeds]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loadingOrders) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
