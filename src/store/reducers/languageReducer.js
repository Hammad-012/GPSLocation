import {SELECT_LANGUAGE} from '../type'
const initialState={
    selectedLanguageName:"English",
    selectedLanguage:{
        privacy_policy:'I read and Accept Privacy Policy',
        Next:'Next',
        onboarding:'Onboarding',
        GPSTracker:'GPSTracker',
        GPSTracker_real_time_location:`GPS tracker real time location pricise safe and Reliable Calculate the distance between two points ${"\n"} and navigate them`,
        skip:'skip',
        station_Alert:"Station Alert",
        Noftify_you:`Notify you when a member of your circle arrives or leaves ${"\n"} a home or place of bussiness`,
        Number_Tracker:'Number Traker',
        Got_Number_Details:`Got Number details and identify the execution ${"\n"}  of desired number`,
        Location:'Location',
        Allow_permission:'Allow Permission',
        Contact:"Contact",
        Share_Location:'Share Location',
        Whatsapp:'Whatsapp',
        Facebook:'Facebook',
        Instagram:'Instagram',
        FindAddress:'Find Address',
        GPS_Coordinate:'GPS Coordinate',
        Home:'Home',
        speedometer:'Speedo Meter',
        search_Number:'Search Number',
        GPS_Tool:'GPS Tool',
        start:'Start',
        Add_New_location:'Add New Location',
        Move_inside:'Moving inside',
        Move_outside:'Moving Outside',
        Add_place:'Add Place',
        selectcountrycode:'Select Country Code',
        enterphonenumber:'Enter Phone Number',
        you_have_not_added_location:'You have not added any location',
        averge_speed:'Avg speed',
         max_speed:'Max speed',
         click_here_to_add_new_location:'Click here to add new location',
         areacode:'Area Code',
          compass:'Compass',
         altitudemeter:'Altitude Meter',
         worldclock:'World Clock',
          ipaddress:'IP Address',
          search:'Search'
    }
}

export const languageReducer = (state=initialState,action) => {
        switch (action.type) {
            case SELECT_LANGUAGE:
                return{
                    ...state,
                    selectedLanguageName:action.payload.selectedLanguageName,
                    selectedLanguage:action.payload.selectedLanguage
                }
            default:
                return state
        }
}