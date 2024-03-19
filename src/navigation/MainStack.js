import {StyleSheet, Text, View,Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from '../screens/SplashScreen';
import LanguageScreen from '../screens/LanguageScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainScreen from '../screens/MainScreen';
import AddNewLocation from '../BottomTabScreen/AddNewLocation';
import GpsTrackerScreen from '../screens/GpsTrackerScreen';
import GpsTrackerHistory from '../screens/GpsTrackerHistory';
import AlltitudeMeterScreen from '../screens/AlltitudeMeterScreen';
import NumberDetailScreen from '../screens/NumberDetailScreen';
import IPAndMacAddress from '../screens/IPAndMacAddress';
import WorldClock from '../screens/WorldClock';
import SelectedTimeScreen from '../screens/SelectedTimeScreen';
import FindAddressScreen from '../screens/FindAddressScreen';
import GPSCordinateScreen from '../screens/GPSCordinateScreen';
import StationAlert from '../screens/StationAlert';
import AdPlacescreen from '../screens/AdPlacescreen';
import AddnewLocationScreen from '../screens/AddnewLocationScreen';
import Compass from '../screens/Compass';
import SavedLocation from '../BottomTabScreen/SavedLocation';
import SearchLocation from '../BottomTabScreen/SearchLocation';
import AreaCode from '../screens/AreaCode';
import {useSelector} from 'react-redux';
import UpdateLocationScreen from '../screens/UpdateLocationScreen';
import DrawerContent from './DrawerContent';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';
import NavigateLocation from '../BottomTabScreen/NavigateLocation';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const MainStack = ({navigation,route}) => {
  const initialRouteName = useSelector(
    state => state.initailRouteReducer.initialRouteName,
  );
  console.log(initialRouteName);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{headerShown: false, headerBackTitleVisible: false}}>
      
      <Stack.Screen 
          name="MainScreen"
         component={MainScreen}
         options={{
          tabBarVisible:false
         }}
       />
      <Stack.Screen
       name="AddNewLocation"
        component={AddNewLocation} 
      />
      <Stack.Screen
       name="GpsTracker" 
       component={GpsTrackerScreen}
       />
      <Stack.Screen 
      name="history"
      component={GpsTrackerHistory} 
      />
      <Stack.Screen 
      name="alltitudemeter"
      component={AlltitudeMeterScreen}
       />
      <Stack.Screen 
      name="numberdetail"
      component={NumberDetailScreen}
       />
      <Stack.Screen
       name="ipmacaddress"
       component={IPAndMacAddress}
       />
      <Stack.Screen 
      name="worldclock" 
      component={WorldClock}
       />
      <Stack.Screen
       name="selectedtimescreen"
       component={SelectedTimeScreen}
       />
      <Stack.Screen
       name="findaddress"
       component={FindAddressScreen}
       />
      <Stack.Screen 
      name="gpscordinatescreen"
      component={GPSCordinateScreen} 
     />
      <Stack.Screen
      name="stationalert" 
      component={StationAlert}
     />
      <Stack.Screen
       name="adplacescreen" 
       component={AdPlacescreen} 
       
       />
      <Stack.Screen
        name="addnewlocationscreen"
        component={AddnewLocationScreen}
      />
      <Stack.Screen
       name="compass" 
       component={Compass} 
       />
      <Stack.Screen 
        name="savedlocation"
        component={SavedLocation} />
      <Stack.Screen name="searchlocation"
       component={SearchLocation} 
       />
      <Stack.Screen 
      name="areacode"
      component={AreaCode} 
      />
      <Stack.Screen
       name="update"
      component={UpdateLocationScreen}
       />
       <Stack.Screen
       name="navigate"
      component={NavigateLocation}
       />
    </Stack.Navigator>
  );
};



const MainStackDrawer = () => (
  <Drawer.Navigator
    initialRouteName="MainStack"
    swipeEnabled={false}
    gestureEnabled={false}
    screenOptions={{
      headerShown: false,
      drawerStyle:{
        width:wp(100)
      }
    }}
    drawerContent={props => {
      return <DrawerContent {...props} />;
    }}>
    <Drawer.Screen name="MainStack">
      {props => <MainStack {...props} />}
    </Drawer.Screen>
  </Drawer.Navigator>
);
export default MainStackDrawer;
