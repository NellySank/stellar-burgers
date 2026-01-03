import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  getFeedsApi
} from '@api';

interface OrdersState {
  orders: TOrder[] | [] | undefined;
  order: TOrder | null;
  feeds: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  loadingAllOrders: boolean;
  loadingFeed: boolean;
  loadingOrder: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: OrdersState = {
  orders: [],
  order: null,
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loadingAllOrders: false,
  loadingFeed: false,
  loadingOrder: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки заказов' + error);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      return rejectWithValue('Ошибка создания заказа' + error);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue('Ошибка загрузки заказа по id' + error);
    }
  }
);

export const fetchFeeds = createAsyncThunk(
  'orders/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const feeds = await getFeedsApi();
      return feeds;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ленты заказов' + error);
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
    },
    // Закрыть модальное окно заказа
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectOrder: (sliceState) => sliceState.order,
    selectFeeds: (sliceState) => sliceState.feeds,
    selectLoadingFeed: (sliceState) => sliceState.loadingFeed,
    selectLoadingAllOrders: (sliceState) => sliceState.loadingAllOrders,
    selectLoadingOrder: (sliceState) => sliceState.loadingOrder,
    selectError: (sliceState) => sliceState.error,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData
  },
  extraReducers: (builder) => {
    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loadingAllOrders = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loadingAllOrders = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loadingAllOrders = false;
        state.error = action.payload as string;
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.order = action.payload;
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.orderRequest = false;
      })
      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loadingOrder = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loadingOrder = false;
          state.order = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loadingOrder = false;
        state.error = action.payload as string;
      })
      // fetchFeeds
      .addCase(fetchFeeds.pending, (state) => {
        state.loadingFeed = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.loadingFeed = false;
          state.feeds = action.payload;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loadingFeed = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder, clearError, closeOrderModal } = ordersSlice.actions;
export const {
  selectOrders,
  selectOrder,
  selectFeeds,
  selectLoadingAllOrders,
  selectLoadingFeed,
  selectLoadingOrder,
  selectError,
  selectOrderRequest,
  selectOrderModalData
} = ordersSlice.selectors;
export default ordersSlice.reducer;
