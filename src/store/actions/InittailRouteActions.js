import { SET_ROUTE_NAME } from "../type";

export const setinittialRoute = routeName => ({
  type: SET_ROUTE_NAME,
  payload: routeName,
});


