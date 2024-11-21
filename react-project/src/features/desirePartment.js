import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    desireApartment: null,
};

const authSlice = createSlice({
    name: 'desireApartment',
    initialState,
    reducers: {
        setdesireApartment(state, action) {
            state.desireApartment = action.payload
        },
        logout_desireApartment(state) {
            state.desireApartment = null
        },
    },
});

export const { setdesireApartment, logout_desireApartment } = authSlice.actions;
export default authSlice.reducer;

