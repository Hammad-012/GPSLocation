import { ADD_NEW_TRACK,DELETE_TRACK } from "../type";


export const addNewTrack = data => {
   console.log(data ,"obj");
    return dispatch => {
        dispatch({
            type:ADD_NEW_TRACK,
            payload:data
        })
    }
}

export const deleteTrack = item => {
    return dispatch => {
        dispatch({
            type:DELETE_TRACK,
            payload:item
        })
    }
}