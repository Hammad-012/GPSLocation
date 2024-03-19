import { SET_ROUTE_NAME } from "../type"
const initialState = {
   initialRouteName:"GetStarted"
}
 const initailRouteReducer = (state=initialState,action) => {
    switch(action.type) {
        case SET_ROUTE_NAME:
            return{
                ...state,
                initialRouteName:action.payload
            }
            default:
                return state
    }
}   
export default initailRouteReducer