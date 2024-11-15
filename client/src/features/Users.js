import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    error: null,
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setuser(state, action) {
            state.user = action.payload
        },
        loginRequest(state) {
            state.error = null;
        },

        loginSuccess(state, action) {
            state.isAuthenticated = true;
        },
        loginFailure(state, action) {
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
        },
    },
});

export const { loginRequest, setuser,loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

