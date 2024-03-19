import {SELECT_LANGUAGE} from '../type';
export const setSelectLanguage = (data) => {
return dispatch =>{
    return new Promise((resolve,reject)=>{
    dispatch({
        type:SELECT_LANGUAGE,
        payload: data,
    })
    resolve();
    })
}
}