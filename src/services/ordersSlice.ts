import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getOrdersApi,
  getFeedsApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';

interface OrdersState {
  orders: TOrder[];
  feeds: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}


const initialState: OrdersState = {
  orders: [],
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  order: null,
  loading: false,
  error: null
};


export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказов');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка создания заказа');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка загрузки заказа по id'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectFeeds: (sliceState) => sliceState.feeds,
    selectOrder: (sliceState) => sliceState.order,
    selectLoading: (sliceState) => sliceState.loading,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.order = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.order = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder, clearError } = ordersSlice.actions;
export const {
  selectOrders,
  selectOrder,
  selectLoading,
  selectError
} = ordersSlice.selectors;
export default ordersSlice.reducer;
