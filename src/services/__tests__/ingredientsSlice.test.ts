import ingredientsSlice, {
  fetchIngredients,
  clearIngredients,
  IngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

// Мокируем данные
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 40,
    carbohydrates: 100,
    calories: 500,
    price: 300,
    image: 'image-url',
    image_mobile: 'image-mobile-url',
    image_large: 'image-large-url'
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 50,
    fat: 30,
    carbohydrates: 20,
    calories: 250,
    price: 200,
    image: 'image-url',
    image_mobile: 'image-mobile-url',
    image_large: 'image-large-url'
  }
];

describe('Тесты для ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchIngredients - экшены', () => {
    const initialState: IngredientsState = {
      ingredients: [],
      loading: false,
      error: null
    };

    it('должен обрабатывать pending состояние', () => {
      const action = fetchIngredients.pending('requestId');
      const state = ingredientsSlice(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = fetchIngredients.fulfilled(
        mockIngredients,
        'requestId',
        undefined
      );

      const state = ingredientsSlice(
        { ...initialState, loading: true },
        action
      );

      expect(state).toEqual({
        ingredients: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов: Test Error';

      const action = fetchIngredients.rejected(
        new Error('Test Error'),
        'requestId',
        undefined,
        errorMessage
      );

      const state = ingredientsSlice(
        { ...initialState, loading: true },
        action
      );

      expect(state).toEqual({
        ingredients: [],
        loading: false,
        error: errorMessage
      });
    });

    it('fetchIngredients должен обработать ошибку API', async () => {
      const errorMessage = 'Какая-то ошибка';

      global.fetch = jest.fn(() =>
        Promise.reject(new Error(errorMessage))
      ) as jest.Mock;

      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await fetchIngredients()(dispatch, getState, undefined);

      expect(result.payload).toContain('Ошибка загрузки ингредиентов');
      expect(result.payload).toContain(errorMessage);
    });
  });
});
