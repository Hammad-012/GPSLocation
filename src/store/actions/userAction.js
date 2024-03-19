import { ADDRESS_LOCATION,
    ADD_COUNTRIES,
  CONTACT_PERMISSION,
  DELETE_COUNTRY,
  LOCATION_PERMISSION,
  SET_CONTACT,
  SET_COUNTRIES,
  SET_HOME,
  SET_LOCATION,
  SET_ROUTE_NAME,
 } from "../type";


 export const setLocationPermission = () => {
    return dispatch => {
        dispatch({
            type:LOCATION_PERMISSION,
            payload:true,
        })
    }
 }

 export const setContactPermission = () => {
    return dispatch => {
        dispatch({
            type:CONTACT_PERMISSION,
            payload:true,
        })
    }
 }

 export const setContact = data => {
    return dispatch => {
        dispatch({
            type:SET_CONTACT,
            payload:data,
        })
    }
 }

 export const setLocation = data => {
    return dispatch => {
        dispatch({
            type:SET_LOCATION,
            payload:data,
        })
    }
 }

 export const setCountry = data => {
    return dispatch => {
      dispatch({
        type: SET_COUNTRIES,
        payload: data,
      });
    };
  };
  
  export const setHomeScreen = () => {
    return dispatch => {
      dispatch({
        type: SET_HOME,
        payload: true,
      });
    };
  };
  
  export const setAddressLocation = data => {
    return dispatch => {
      dispatch({
        type: ADDRESS_LOCATION,
        payload: data,
      });
    };
  };
  
  export const addTimeZoneCountry = data => {
    return dispatch => {
      dispatch({
        type: ADD_COUNTRIES,
        payload: data,
      });
    };
  };
  
  export const deleteTimeZoneCountry = data => {
    return dispatch => {
      dispatch({
        type: DELETE_COUNTRY,
        payload: data,
      });
    };
  };
  
  export const setRouteName = data => {
    return dispatch => {
      return new Promise(function (resolve, reject) {
        dispatch({
          type: SET_ROUTE_NAME,
          payload: data,
        });
        resolve();
      });
    };
  };
  