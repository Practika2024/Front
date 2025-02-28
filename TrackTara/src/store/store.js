import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import userReducer from '../store/state/reduserSlises/userSlice';
import usersReducer from '../store/state/reduserSlises/usersSlice';
import categoryReducer from '../store/state/reduserSlises/categorySlice';
import manufacturerReducer from '../store/state/reduserSlises/manufacturerSlice';
import productReducer from '../store/state/reduserSlises/productSlice';
import appSettingSlice from '../store/state/reduserSlises/appSettingSlice';
import roleReducer from '../store/state/reduserSlises/roleSlice';
import cartItemReducer from '../store/state/reduserSlises/cartItemSlice';
import filtersReducer from '../store/state/reduserSlises/filtersSlice';
import containersReducer from '../store/state/reduserSlises/containerSlice';
import productTypeReducer from '../store/state/reduserSlises/productTypeSlice';
import containerHistoryReducer from '../store/state/reduserSlises/containerHistorySlice';
export const rootReducer = combineReducers({
    user: userReducer,
    containerHistory: containerHistoryReducer,
    role: roleReducer,
    category: categoryReducer,
    manufacturer: manufacturerReducer,
    product: productReducer,
    appSettings: appSettingSlice,
    users: usersReducer,
    filters: filtersReducer,
    containers: containersReducer,
    cartItem: cartItemReducer,
    productTypes: productTypeReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});