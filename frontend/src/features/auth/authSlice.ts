import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  organizationId: string | null;
  email: string | null;
  ddrsUserId: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  role: null,
  organizationId: null,
  email: null,
  ddrsUserId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; role: string }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      // Parse extra claims from JWT payload
      try {
        const payload = JSON.parse(atob(action.payload.token.split('.')[1]));
        state.organizationId = payload.organization_id || null;
        state.email = payload.email || null;
        state.ddrsUserId = payload.ddrs_user_id || null;
      } catch {
        state.organizationId = null;
        state.email = null;
        state.ddrsUserId = null;
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.organizationId = null;
      state.email = null;
      state.ddrsUserId = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

