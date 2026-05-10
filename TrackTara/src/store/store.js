import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
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
import productHistoryReducer from '../store/state/reduserSlises/productHistorySlice';
import containerTypesReducer from '../store/state/reduserSlises/containerTypeSlice';

export const rootReducer = combineReducers({
    user: userReducer,
    containerHistory: containerHistoryReducer,
    productHistory: productHistoryReducer,
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
    containerTypes: containerTypesReducer,
});

const persistConfig = {
    key: 'tracktara',
    version: 2,
    storage,
    /** Усі зведені редʼюсери — кошик, фільтри, кеш списків тощо між F5 (localStorage, ~5 МБ ліміт). */
    whitelist: [
        'user',
        'containerHistory',
        'productHistory',
        'role',
        'category',
        'manufacturer',
        'product',
        'appSettings',
        'users',
        'filters',
        'containers',
        'cartItem',
        'productTypes',
        'containerTypes',
    ],
    migrate: (persistedState) => {
        if (!persistedState) return Promise.resolve(undefined);
        const next = { ...persistedState };
        if (next.user && Object.prototype.hasOwnProperty.call(next.user, 'favoriteProducts')) {
            delete next.user.favoriteProducts;
        }
        return Promise.resolve(next);
    },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(thunk),
});

export const persistor = persistStore(store);