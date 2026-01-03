import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/ingredientsSlice';
import { useSelector, useDispatch } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === id);

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
