import reducer, {
  addIngredient,
  removeIngredient,
  setBun,
  clearConstructor,
  selectConstructorItems,
  ConstructorState
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

// Моковые данные
const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun-image.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockIngredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 300,
  image: 'sauce-image.png',
  image_mobile: 'sauce-mobile.png',
  image_large: 'sauce-large.png'
};

describe('Тесты для constructorSlice', () => {
  const initialState: ConstructorState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    counter: 0
  };

  describe('Начальное состояние', () => {
    it('Вернет начальное состояние', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('Добавление ингридиетов', () => {
    it('При добавлении ингридиента - возвращает массив ингридиентов', () => {
      const action = addIngredient(mockIngredient);
      const result = reducer(initialState, action);

      expect(result.constructorItems.ingredients).toHaveLength(1);
      expect(result.constructorItems.ingredients[0]).toEqual({
        ...mockIngredient,
        id: 'ingredient-0'
      });
      expect(result.counter).toBe(1);
    });

    it('При добавлении ингридиента увеличивает счётчик', () => {
      let state = initialState;

      state = reducer(state, addIngredient(mockIngredient));
      expect(state.counter).toBe(1);
      expect(state.constructorItems.ingredients[0].id).toBe('ingredient-0');

      const secondIngredient = { ...mockIngredient, _id: 'ingredient-2' };
      state = reducer(state, addIngredient(secondIngredient));

      expect(state.counter).toBe(2);
      expect(state.constructorItems.ingredients[1].id).toBe('ingredient-1');
    });
  });

  describe('Удаление ингридиентов', () => {
    it('Должен корректно удалить заданный ингридиент', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      const secondIngredient = { ...mockIngredient, _id: 'ingredient-2' };
      state = reducer(state, addIngredient(secondIngredient));
      const thirdIngredient = { ...mockIngredient, _id: 'ingredient-3' };
      state = reducer(state, addIngredient(thirdIngredient));

      expect(state.constructorItems.ingredients).toHaveLength(3);

      state = reducer(state, removeIngredient(1));

      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.constructorItems.ingredients[0]._id).toBe('ingredient-1');
      expect(state.constructorItems.ingredients[1]._id).toBe('ingredient-3');
    });

    it('Должен корректно удалить первый ингридиент', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      const secondIngredient = { ...mockIngredient, _id: 'ingredient-2' };
      state = reducer(state, addIngredient(secondIngredient));

      state = reducer(state, removeIngredient(0));

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]._id).toBe('ingredient-2');
    });

    it('Должен корректно удалить последний ингридиент', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      const secondIngredient = { ...mockIngredient, _id: 'ingredient-2' };
      state = reducer(state, addIngredient(secondIngredient));

      state = reducer(state, removeIngredient(1));

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]._id).toBe('ingredient-1');
    });
  });

  describe('Очищение конструктора', () => {
    it('should clear all ingredients and reset counter', () => {
      let state = reducer(initialState, setBun(mockBun));
      state = reducer(state, addIngredient(mockIngredient));
      const secondIngredient = { ...mockIngredient, _id: 'ingredient-2' };
      state = reducer(state, addIngredient(secondIngredient));

      expect(state.constructorItems.bun).not.toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.counter).toBe(2);

      state = reducer(state, clearConstructor());

      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(0);
      expect(state.counter).toBe(0);
    });
  });

  describe('Селекторы', () => {
    it('selectConstructorItems должен вернуть все ингридиенты', () => {
      const state = {
        constructorBurger: {
          constructorItems: {
            bun: mockBun,
            ingredients: [
              {
                ...mockIngredient,
                id: 'ingredient-0'
              }
            ]
          },
          counter: 1
        }
      };

      expect(selectConstructorItems(state)).toEqual({
        bun: mockBun,
        ingredients: [
          {
            ...mockIngredient,
            id: 'ingredient-0'
          }
        ]
      });
    });
  });
});
