import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams, useLocation } from 'react-router-dom';
import {
  selectIngredients,
  fetchIngredients,
  selectIngredientsLoading
} from '../../services/ingredientsSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  useEffect(() => {
    if (!backgroundLocation) {
      dispatch(fetchIngredients());
    }
  }, [backgroundLocation]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : ingredientData ? (
        <IngredientDetailsUI ingredientData={ingredientData} />
      ) : null}
    </>
  );
};
