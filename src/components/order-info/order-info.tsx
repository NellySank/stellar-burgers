import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrder,
  fetchOrderByNumber,
  selectLoadingOrder
} from '../../services/ordersSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/ingredientsSlice';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const backgroundLocation = location.state?.background;

  const orderData = useSelector(selectOrder) ?? {
    createdAt: '',
    ingredients: [],
    _id: '',
    status: '',
    name: '',
    updatedAt: 'string',
    number: 0
  };

  const loadingOrder = useSelector(selectLoadingOrder);

  const ingredients: TIngredient[] = useSelector(selectIngredients) ?? [];

  useEffect(() => {
    dispatch(fetchOrderByNumber(Number(number)));
    if (!backgroundLocation) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, fetchOrderByNumber, fetchIngredients]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>{loadingOrder ? <Preloader /> : <OrderInfoUI orderInfo={orderInfo} />}</>
  );
};
