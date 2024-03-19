import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import countryReducer from './reducers/CountryReducers';
import trackReducer from './reducers/trackReducer';
import {mapsApi} from '../service/mapAPI';
import {configureStore} from '@reduxjs/toolkit';
import initailRouteReducer from './reducers/initialRouteReducer';
import locationAlertReducer from './reducers/locationAlertReducer';
import userReducer from './reducers/userReducer';
import { languageReducer } from './reducers/languageReducer';
const trackPersistConfig = {
  key: 'track_key',
  storage: AsyncStorage,
  whitelist: ['track'],
};

const routeOCnfig = {
  key: 'inite_key',
  storage: AsyncStorage,
  whitelist: ['initialRouteName'],
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'address_location',
    'countryCode',
    'is_home_screen',
    'selected_countries',
    'location',
  ],
};

const locationAlertPersistConfig = {
  key: 'alert',
  storage: AsyncStorage,
  whitelist: ['alerts'],
};
const rootReducer = combineReducers({
  countryReducer: countryReducer,
  trackReducer: persistReducer(trackPersistConfig, trackReducer),
  initailRouteReducer: persistReducer(routeOCnfig, initailRouteReducer),
  userReducer: persistReducer(persistConfig, userReducer),
  languageReducer:languageReducer,
  locationAlertReducer: persistReducer(
    locationAlertPersistConfig,
    locationAlertReducer,
  ),
  [mapsApi.reducerPath]: mapsApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      serializableCheck: false,
    }).concat(mapsApi.middleware),
});
export const persistor = persistStore(store);
