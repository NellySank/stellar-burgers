import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface ConstructorState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

// Слайс
const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    // Добавить ингредиент
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newItem: TConstructorIngredient = {
        ...action.payload,
        id: crypto.randomUUID()
      };
      state.constructorItems.ingredients.push(newItem);
    },
    // Удалить ингредиент по индексу
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    // Установить булку
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    // Очистить конструктор
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: (sliceState) => sliceState.constructorItems
  }
});

export const { addIngredient, removeIngredient, setBun, clearConstructor } =
  constructorSlice.actions;
export const { selectConstructorItems } = constructorSlice.selectors;
export default constructorSlice.reducer;
