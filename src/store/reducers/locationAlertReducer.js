import {
  ADD_LOCATION_ALERT,
  DELETE_LOCATION_ALERT,
  ENTRY_ALERT,
  EXIT_ALERT,
  UPDATE_ALERT_ITEM_COMPLETE,
  UPDATE_LOCATION_ALERT_ITEM,
} from '../type';

const initialState = {
  alerts: [],
  alerts_obj: {
    id: '',
    name: '',
    radius: '',
    is_notification: false,
    is_in_radius: false,
    arrival_time: null,
    exit_time: null,
    is_notify_on_arrival: false,
    is_notify_on_exit: false,
    active: true,
    unit: 'M',
  },
};


const locationAlertReducer = (state = initialState,action) => {
    switch (action.type) {
        case ADD_LOCATION_ALERT:
        return {
            ...state,
            alerts:[action.payload, ...state.alerts]
        }
        case DELETE_LOCATION_ALERT:
            return {
                ...state,
                alerts:[
                    ...state.alerts.filter(
                        item => item.timestamp != action.payload.timestamp
                    )
                ]
            }
            case UPDATE_LOCATION_ALERT_ITEM:
                return{
                    ...state,
                    alerts:[
                        ...state.alerts.slice(0,action.payload.index),
                        {
                            ...state.alerts[action.payload.index],
                            is_in_radius:action.payload.is_in_radius,
                            is_notification:action.payload.is_notification,
                            exit_time:action.payload.exit_time,
                            arrival_time:action.payload.arrival_time,
                        },
                        ...state.alerts.slice(action.payload.index + 1)
                    ]
                }

                case UPDATE_ALERT_ITEM_COMPLETE:
                      const newArray = [...state.alerts]
                        newArray[action.payload.index] = action.payload.item
                        return{
                            ...state,
                            alerts:newArray
                        }
                        case ENTRY_ALERT:
                            return{
                                ...state,
                                alerts:[
                                    ...state.alerts.slice(0,action.payload.index),
                                    {
                                        ...state.alerts[action.payload.index],
                                        is_notify_on_arrival: action.payload.is_notify_on_arrival,
                                      },
                                      ...state.alerts.slice(action.payload.index + 1),
                                ]
                            }
                    
    
        default:
            return state
            
    }
}
export default locationAlertReducer