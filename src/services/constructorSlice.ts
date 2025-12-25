import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface ConstructorState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'constructorBurger/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка создания заказа');
    }
  }
);

// Слайс
const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    // Добавить ингредиент (генерируем ID здесь, если не передан)
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
    },
    // Закрыть модальное окно заказа
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;
export const {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} = constructorSlice.selectors;
export default constructorSlice.reducer;
