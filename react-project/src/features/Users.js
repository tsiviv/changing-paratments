import { createSlice } from '@reduxjs/toolkit';
const token = localStorage.getItem('token');
const initialState = {
    isAuthenticated: token ? true : false,
    error: null,
    user: null,
    ModalShow: false,
    ModalShowDetails: false
};

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setuser(state, action) {
            console.log(action)
            state.user = action.payload
            console.log(state.user)
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
            localStorage.clear();
        },
        setModalShowDetails(state) {
            state.ModalShowDetails = state.ModalShowDetails ? false : true
        },
        setModalShow(state) {
            console.log(state.ModalShow)
            state.ModalShow = state.ModalShow ? false : true
        }
    },
});

export const { loginRequest, setuser, setModalShow, setModalShowDetails, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

