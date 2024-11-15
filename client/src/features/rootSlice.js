import { combineReducers } from '@reduxjs/toolkit';
import user from './Users';

const rootReducer = combineReducers({
    user: user,
});

export default rootReducer;