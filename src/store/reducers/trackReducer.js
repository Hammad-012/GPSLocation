import { ADD_NEW_TRACK,DELETE_TRACK } from "../type";
const initialState = {
    track:[],
    track_obj:{
        id:'1',
        name:'',
        date:'',
        time:'',
        start_address:'',
        end_address:'',
        distance:'',
        duration:'',
        avg_speed:'',
        max_speed: '110 km/hr',
        coordinates:[]
    },
}
const trackReducer = (state=initialState,action) => {
   
    switch (action.type) {
        case ADD_NEW_TRACK:
            return{
                ...state,
                track:[action.payload,...state.track]
            }
            case DELETE_TRACK:
                return{
                    ...state,
                    track:[
                        state.track.filter(item => item.name !=action.payload.name)
                    ]
                }
        default:
            return state
           
    }
}
export default trackReducer