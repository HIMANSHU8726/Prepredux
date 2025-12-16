import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  token: string | null;
  cookie: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  cookie: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string; cookie: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.cookie = action.payload.cookie;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.cookie = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
