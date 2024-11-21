import { combineReducers } from '@reduxjs/toolkit';
import user from './Users';
import desirePartment from './desirePartment';
import Apartment from './partment'
const rootReducer = combineReducers({
    user: user,
    Apartment:Apartment,
    desirePartment:desirePartment
});

export default rootReducer;