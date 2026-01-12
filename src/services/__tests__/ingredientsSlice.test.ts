import { configureStore } from '@reduxjs/toolkit';
import ingredientsSlice, {
  fetchIngredients,
  clearIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'image1.jpg',
    image_mobile: 'image1-mobile.jpg',
    image_large: 'image1-large.jpg'
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 200,
    price: 75,
    image: 'image2.jpg',
    image_mobile: 'image2-mobile.jpg',
    image_large: 'image2-large.jpg'
  }
];

// Mock API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Тесты для ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тесты для fetchIngredients
  describe('Тесты экшена fetchIngredients', () => {
    it('должны быть вызваны pending and fulfilled actions при успешной загрузке ингредиентов', async () => {
      (getIngredientsApi as jest.Mock).mockResolvedValueOnce(mockIngredients);

      const store = configureStore({
        reducer: { ingredients: ingredientsSlice }
      });

      const promise = store.dispatch(fetchIngredients());

      // состояние (pending)
      const pendingState = store.getState().ingredients;
      expect(pendingState.loading).toBe(true);
      expect(pendingState.error).toBeNull();
      expect(pendingState.ingredients).toEqual([]);

      await promise;

      // состояние (fulfilled)
      const fulfilledState = store.getState().ingredients;
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.error).toBeNull();
      expect(fulfilledState.ingredients).toEqual(mockIngredients);
    });

    it('должны быть вызваны pending and reject actions при ошибке загрузки ингредиентов', async () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      (getIngredientsApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: { ingredients: ingredientsSlice }
      });

      const promise = store.dispatch(fetchIngredients());

      // состояние (pending)
      const pendingState = store.getState().ingredients;
      expect(pendingState.loading).toBe(true);
      expect(pendingState.error).toBeNull();

      await promise;

      // состояние (rejected)
      const rejectedState = store.getState().ingredients;
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка загрузки ингредиентов');
      expect(rejectedState.ingredients).toEqual([]);
    });

    it('должен корректно обрабатывать пустой массив ингредиентов', async () => {
      (getIngredientsApi as jest.Mock).mockResolvedValueOnce([]);

      const store = configureStore({
        reducer: { ingredients: ingredientsSlice }
      });

      await store.dispatch(fetchIngredients());

      const state = store.getState().ingredients;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });

  // Тесты для селекторов
  describe('Тесты селекторов', () => {
    const mockState = {
      ingredients: {
        ingredients: mockIngredients,
        loading: true,
        error: 'Тестовая ошибка'
      }
    };

    it('selectIngredients должен возвращать список ингредиентов', () => {
      const result = selectIngredients(mockState);
      expect(result).toEqual(mockIngredients);
    });

    it('selectIngredientsLoading должен возвращать состояние загрузки', () => {
      const result = selectIngredientsLoading(mockState);
      expect(result).toBe(true);
    });

    it('selectIngredientsError должен возвращать ошибку', () => {
      const result = selectIngredientsError(mockState);
      expect(result).toBe('Тестовая ошибка');
    });

    it('селекторы должны корректно работать с пустым состоянием', () => {
      const emptyState = {
        ingredients: {
          ingredients: [],
          loading: false,
          error: null
        }
      };

      expect(selectIngredients(emptyState)).toEqual([]);
      expect(selectIngredientsLoading(emptyState)).toBe(false);
      expect(selectIngredientsError(emptyState)).toBeNull();
    });
  });

  // Тесты для начального состояния
  describe('Начальное состояние', () => {
    it('должен иметь правильное начальное состояние', () => {
      const store = configureStore({
        reducer: { ingredients: ingredientsSlice }
      });

      const initialState = store.getState().ingredients;
      expect(initialState).toEqual({
        ingredients: [],
        loading: false,
        error: null
      });
    });
  });
});
