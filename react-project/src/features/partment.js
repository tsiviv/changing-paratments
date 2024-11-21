import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Apartment: null,
};

const authSlice = createSlice({
    name: 'Apartment',
    initialState,
    reducers: {
        setApartment(state, action) {
            console.log(action)
            state.Apartment = action.payload
        },
        logout_Apartment(state) {
            state.Apartment = null
        },
    },
});

export const { setApartment, logout_Apartment } = authSlice.actions;
export default authSlice.reducer;

