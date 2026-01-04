import { combineSlices } from '@reduxjs/toolkit';
import ingredientsSlice from './ingredientsSlice';
import constructorSlice from './constructorSlice';
import ordersSlice from './ordersSlice';
import ProfileSlice from './profileSlice';

const testRootReducer = combineSlices({
  ingredients: ingredientsSlice,
  constructorBurger: constructorSlice,
  orders: ordersSlice,
  auth: ProfileSlice
});

describe('rootReducer настройки', () => {
  test('Должен возвращать правильное начальное состояние для неопределенного состояния и неизвестного действия', () => {
    const resultState = testRootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expectedState = {
      ingredients: ingredientsSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      constructorBurger: constructorSlice(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      orders: ordersSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      auth: ProfileSlice(undefined, { type: 'UNKNOWN_ACTION' })
    };

    expect(resultState).toEqual(expectedState);
  });
});
