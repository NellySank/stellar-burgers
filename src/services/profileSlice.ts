import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  refreshToken,
  TRegisterData,
  TLoginData
} from '@api';

type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | undefined | null;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: undefined
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Оибка при регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при логине');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при обновлении пароля');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка сброса пароля');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка при получении данных пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка обновления данных пользователя'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка logout');
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка обновления токена');
    }
  }
);

const ProfileSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    selectUser: (sliceState: AuthState) => sliceState.user,
    selectIsAuthenticated: (sliceState: AuthState) =>
      sliceState.isAuthenticated,
    selectIsAuthChecked: (sliceState: AuthState) => sliceState.isAuthChecked,
    selectLoading: (sliceState: AuthState) => sliceState.loading,
    selectError: (sliceState: AuthState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Вход
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Забыли пароль
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Сброс пароля
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Получение пользователя
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.error.message;
      })
      // Обновление пользователя
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Обновление токена
      .addCase(refreshUserToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.error.message;
      });
  }
});

export const { clearError, setAuthChecked } = ProfileSlice.actions;
export const {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectLoading,
  selectError
} = ProfileSlice.selectors;
export default ProfileSlice.reducer;
