import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectLoadingFeed
} from '../../services/ordersSlice';
import { fetchIngredients } from '../../services/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeeds).orders;
  const loadingFeed = useSelector(selectLoadingFeed);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
  }, [dispatch, fetchIngredients, fetchFeeds]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loadingFeed) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
