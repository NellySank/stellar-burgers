import { configureStore } from '@reduxjs/toolkit';
import ProfileSlice, {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  AuthState
} from '../profileSlice';
import { TUser } from '@utils-types';
import {
  TAuthResponse,
  TRegisterData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { deleteCookie } from '../../utils/cookie';

// Mock данных
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: null
};

const requestId = 'test-request-id';
const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123'
};

const mockAuthResponse: TAuthResponse = {
  success: true,
  user: mockUser,
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
};

const mockLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

const mockUserResponse = {
  success: true,
  user: mockUser
};

jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  refreshToken: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => 'mock-access-token')
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock as any;

describe('Тесты для ProfileSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // registerUser
  describe('Тесты экшена registerUser', () => {
    it('должны быть вызваны pending and fulfilled actions при успешном response', async () => {
      (registerUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // начальное состояние
      expect(store.getState().auth.loading).toBe(false);

      const promise = store.dispatch(registerUser(mockRegisterData));

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().auth;
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должны быть вызваны pending and reject actions если response API с ошибкой', async () => {
      (registerUserApi as jest.Mock).mockRejectedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // начальное состояние
      expect(store.getState().auth.loading).toBe(false);

      const promise = store.dispatch(registerUser(mockRegisterData));

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().auth;
      expect(state.error).toBe('Ошибка при регистрации');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  // loginUser
  describe('Тесты экшена loginUser', () => {
    it('должны быть вызваны pending and fulfilled actions при успешном response', async () => {
      // Мокаем API
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // начальное состояние
      expect(store.getState().auth.loading).toBe(false);
      expect(store.getState().auth.error).toBeUndefined();

      const promise = store.dispatch(loginUser(mockLoginData));

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должны быть вызваны pending and reject actions если response API с ошибкой', async () => {
      const errorMessage = 'Ошибка при логине';

      // Мокаем ошибку при логине
      (loginUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // начальное состояние
      expect(store.getState().auth.loading).toBe(false);

      const promise = store.dispatch(loginUser(mockLoginData));

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);
    });
  });

  describe('Тесты экшена getUser', () => {
    it('должны быть вызваны pending and fulfilled actions при успешном response', async () => {
      const mockUserResponse = {
        success: true,
        user: mockUser
      };

      (getUserApi as jest.Mock).mockResolvedValueOnce(mockUserResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // начальное состояние
      expect(store.getState().auth.loading).toBe(false);
      expect(store.getState().auth.error).toBeUndefined();
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.isAuthChecked).toBe(false);

      const promise = store.dispatch(getUser());

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должны быть вызваны pending and reject actions если response API с ошибкой', async () => {
      const errorMessage = 'Необходимо авторизоваться';

      (getUserApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // начальное состояние
      expect(store.getState().auth.loading).toBe(false);
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.isAuthChecked).toBe(false);

      const promise = store.dispatch(getUser());

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен установить isAuthenticated в false и isAuthChecked в true при ошибке авторизации', async () => {
      const errorMessage = 'Необходимо авторизоваться';

      (getUserApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      await store.dispatch(getUser());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(errorMessage);
    });
  });

  // updateUser
  describe('Тесты экшена updateUser', () => {
    const mockUpdatedUser: TUser = {
      email: 'updated@example.com',
      name: 'Updated User'
    };

    const mockUpdateData = {
      email: 'updated@example.com',
      name: 'Updated User',
      password: 'newpassword123'
    };

    const mockUpdateResponse = {
      success: true,
      user: mockUpdatedUser
    };

    it('должны быть вызваны pending and fulfilled actions при успешном обновлении', async () => {
      (updateUserApi as jest.Mock).mockResolvedValueOnce(mockUpdateResponse);
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // сначала логинимся
      await store.dispatch(loginUser(mockLoginData));

      // начальное состояние
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.loading).toBe(false);
      expect(store.getState().auth.error).toBeNull();

      const promise = store.dispatch(updateUser(mockUpdateData));

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (fulfilled)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUpdatedUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должны быть вызваны pending and reject actions при ошибке обновления', async () => {
      const errorMessage = 'Ошибка обновления данных пользователя';

      (updateUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // сначала логинимся
      await store.dispatch(loginUser(mockLoginData));

      const promise = store.dispatch(updateUser(mockUpdateData));

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);

      // данные пользоваля не должны измениться при ошибке
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен сохраниться предыдущие данные пользователя при ошибке обновления', async () => {
      const errorMessage = 'Ошибка с сервера';
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);
      (updateUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      await store.dispatch(loginUser(mockLoginData));

      await store.dispatch(updateUser(mockUpdateData));

      const state = store.getState().auth;

      // данные пользователя не должны измениться
      expect(state.user?.email).toBe(mockLoginData.email);
      expect(state.user?.name).toBe('Test User');
    });

    it('должно корректно обрабатывать частичное обновление данных', async () => {
      const userNameNew = 'Новое имя пользователя';
      const partialUpdateData = {
        name: userNameNew
      };

      const partialResponse = {
        success: true,
        user: {
          ...mockUser,
          name: userNameNew
        }
      };

      (updateUserApi as jest.Mock).mockResolvedValueOnce(partialResponse);
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      await store.dispatch(loginUser(mockLoginData));

      await store.dispatch(updateUser(partialUpdateData));

      const state = store.getState().auth;
      expect(state.user?.name).toBe(userNameNew);
      // Email должен остаться прошлым
      expect(state.user?.email).toBe(mockUser.email);
    });
  });

  // logout
  describe('Тесты экшена logoutUser', () => {
    const mockLogoutResponse = {
      success: true,
      message: 'Успешный logout'
    };

    it('должны быть вызваны pending and fulfilled actions при успешном выходе', async () => {
      (logoutApi as jest.Mock).mockResolvedValueOnce(mockLogoutResponse);
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // сначала логинимся
      await store.dispatch(loginUser(mockLoginData));

      // Проверяем начальное состояние
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.isAuthChecked).toBe(true);

      const promise = store.dispatch(logoutUser());

      // Проверяем состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // Проверяем состояние (fulfilled)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должны быть вызваны pending and reject actions при ошибке выхода', async () => {
      const errorMessage = 'Ошибка logout';

      (logoutApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // сначала логинимся
      await store.dispatch(loginUser(mockLoginData));

      const promise = store.dispatch(logoutUser());

      // состояние (pending)
      expect(store.getState().auth.loading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      await promise;

      // состояние (rejected)
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен очищать куки и localStorage при успешном выходе', async () => {
      (logoutApi as jest.Mock).mockResolvedValueOnce(mockLogoutResponse);
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const store = configureStore({
        reducer: { auth: ProfileSlice }
      });

      // сначала логинимся
      await store.dispatch(loginUser(mockLoginData));

      await store.dispatch(logoutUser());

      // Проверяем, что функции очистки были вызваны
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });
});
