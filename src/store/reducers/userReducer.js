import {
  ADDRESS_LOCATION,
  ADD_COUNTRIES,
  CONTACT_PERMISSION,
  DELETE_COUNTRY,
  LOCATION_PERMISSION,
  SET_CONTACT,
  SET_COUNTRIES,
  SET_HOME,
  SET_LOCATION,
  SET_ROUTE_NAME,
} from '../type';

const initialState = {
  locationPermission: false,
  contactPermission: false,
  location: {
    coords: {
      lattitude: 0,
      longitude:0,
    },
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  },
  routeName: '',
  address_location: {
    latitude: 0,
    longitude: 0,
  },
  contacts: [],
  is_home_screen: false,
  countryCode: 'US',
  selected_countries: [],
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_PERMISSION:
      return {
        ...state,
        locationPermission: true,
      };
    case CONTACT_PERMISSION:
      return {
        ...state,
        contactPermission: true,
      };
    case SET_CONTACT:
      return {
        ...state,
        contacts: action.payload,
      };
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case SET_COUNTRIES:
      return {
        ...state,
        countryCode: action.payload,
      };
    case SET_HOME:
      return {
        ...state,
        is_home_screen: true,
      };
    case ADDRESS_LOCATION:
      return {
        ...state,
        address_location: action.payload,
      };
    case ADD_COUNTRIES:
      return {
        ...state,
        selected_countries: [action.payload, ...state.selected_countries],
      };
    case DELETE_COUNTRY:
      return {
        ...state,
        selected_countries: state.selected_countries.filter(
          item => item.countryName != action.payload.countryName,
        ),
      };
    case SET_ROUTE_NAME:
      return {
        ...state,
        routeName: action.payload,
      };
    default:
      return state;
      break;
  }
};
export default userReducer