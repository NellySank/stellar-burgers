import { configureStore } from '@reduxjs/toolkit';
import ordersSlice, {
  fetchOrders,
  createOrder,
  fetchOrderByNumber,
  fetchFeeds,
  clearOrder,
  clearError,
  closeOrderModal
} from '../ordersSlice';
import { TOrder } from '@utils-types';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  getFeedsApi
} from '@api';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 1,
  ingredients: ['ingredient1', 'ingredient2']
};

const mockOrders: TOrder[] = [mockOrder];

const mockFeedsResponse = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

// Mock API
jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getFeedsApi: jest.fn()
}));

describe('Тесты для ordersSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Тесты экшена fetchOrders', () => {
    it('должны быть вызваны pending and fulfilled actions при успешной загрузке заказов', async () => {
      (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockOrders);

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(fetchOrders());

      // состояние (pending)
      expect(store.getState().orders.loadingAllOrders).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      //  состояние (fulfilled)
      const state = store.getState().orders;
      expect(state.loadingAllOrders).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrders);
    });

    it('должны быть вызваны pending and reject actions при ошибке загрузки заказов', async () => {
      const errorMessage = 'Ошибка сети';
      (getOrdersApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(fetchOrders());

      // состояние (pending)
      expect(store.getState().orders.loadingAllOrders).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().orders;
      expect(state.loadingAllOrders).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказов');
      expect(state.orders).toEqual([]);
    });
  });

  // Тесты для createOrder
  describe('Тесты экшена createOrder', () => {
    const mockIngredients = ['ingredient1', 'ingredient2'];

    it('должны быть вызваны pending and fulfilled actions при успешном создании заказа', async () => {
      (orderBurgerApi as jest.Mock).mockResolvedValueOnce({
        order: mockOrder
      });

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(createOrder(mockIngredients));

      // состояние (pending)
      expect(store.getState().orders.orderRequest).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().orders;
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBeNull();
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должны быть вызваны pending and reject actions при ошибке создания заказа', async () => {
      const errorMessage = 'Ошибка создания';
      (orderBurgerApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(createOrder(mockIngredients));

      // состояние (pending)
      expect(store.getState().orders.orderRequest).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().orders;
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
      expect(state.order).toBeNull();
      expect(state.orderModalData).toBeNull();
    });
  });

  // Тесты для fetchOrderByNumber
  describe('Тесты экшена fetchOrderByNumber', () => {
    it('должны быть вызваны pending and fulfilled actions при успешной загрузке заказа по номеру', async () => {
      (getOrderByNumberApi as jest.Mock).mockResolvedValueOnce({
        orders: [mockOrder]
      });

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(fetchOrderByNumber(1));

      // состояние (pending)
      expect(store.getState().orders.loadingOrder).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().orders;
      expect(state.loadingOrder).toBe(false);
      expect(state.error).toBeNull();
      expect(state.order).toEqual(mockOrder);
    });
  });

  // Тесты для fetchFeeds
  describe('Тесты экшена fetchFeeds', () => {
    it('должны быть вызваны pending and fulfilled actions при успешной загрузке ленты заказов', async () => {
      (getFeedsApi as jest.Mock).mockResolvedValueOnce(mockFeedsResponse);

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(fetchFeeds());

      // состояние (pending)
      expect(store.getState().orders.loadingFeed).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().orders;
      expect(state.loadingFeed).toBe(false);
      expect(state.error).toBeNull();
      expect(state.feeds).toEqual(mockFeedsResponse);
    });

    it('должны быть вызваны pending and reject actions при ошибке загрузки ленты заказов', async () => {
      const errorMessage = 'Ошибка сервера';
      (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const store = configureStore({
        reducer: { orders: ordersSlice }
      });

      const promise = store.dispatch(fetchFeeds());

      // состояние (pending)
      expect(store.getState().orders.loadingFeed).toBe(true);
      expect(store.getState().orders.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().orders;
      expect(state.loadingFeed).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ленты заказов');
      expect(state.feeds).toEqual({
        orders: [],
        total: 0,
        totalToday: 0
      });
    });
  });
});
