import {
    ADD_LOCATION_ALERT,
    DELETE_LOCATION_ALERT,
    ENTRY_ALERT,
    EXIT_ALERT,
    UPDATE_ALERT_ITEM_COMPLETE,
    UPDATE_LOCATION_ALERT_ITEM,
  } from '../type';



  export const addLocationAlert = data => {
    console.log('data in add location',data)
    return dispatch => {
        var promise1 = new Promise(function (resolve,reject) {
            dispatch({
                type:ADD_LOCATION_ALERT,
                payload:data
            })
            resolve()
        })
        return promise1
    }
  }

  export const updateLocationAlertItem = item => {
    return dispatch => {
        var promise1 = new Promise(function (resolve,reject) {
            dispatch({
                type:UPDATE_LOCATION_ALERT_ITEM,
                payload:item

            })
        })
    }
  }

  export const updateLocationAlert = data => {
    return dispatch => {
        var promise1 = new Promise(function (resolve,reject) {
            dispatch({
                type:UPDATE_ALERT_ITEM_COMPLETE,
                payload:data
            })
            resolve()
        })
        return promise1
    }
  }

  export const deleteLocationAlert = item => {
    return dispatch => {
      dispatch({
        type: DELETE_LOCATION_ALERT,
        payload: item,
      });
    };
  };

  export const updateEntryAlertNotification = item => {
    return dispatch => {
      dispatch({
        type: ENTRY_ALERT,
        payload: item,
      });
    };
  };
  
  export const updateExitAlertNotification = item => {
  
    return dispatch => {
      dispatch({
        type: EXIT_ALERT,
        payload: item,
      });
    };
  };