import { SET_COUNTRIES } from "../type";


const initialState = {
   country :{
    name:'United States',
    code : 'US',
    callingcode:'1'
   }
}

 const countryReducer = (state=initialState,action) => {
    switch(action.type) {
        case SET_COUNTRIES:
            return{
                ...state,
                country:action.payload
            }
            default:
                return state
    }
}   
export default countryReducer