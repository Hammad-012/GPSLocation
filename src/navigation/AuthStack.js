import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useSelector} from 'react-redux';
import LanguageScreen from '../screens/LanguageScreen';
import MainScreen from '../screens/MainScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import SplashScreen from '../screens/SplashScreen';
import fonts from '../constants/font';
const Stack = createNativeStackNavigator();
function AuthStack() {
  const initialRouteName = useSelector(
    state => state.initailRouteReducer.initialRouteName,
  );
  console.log(initialRouteName);
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: '#3972FE',
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
        },
      }}>
      <Stack.Screen name="GetStarted" component={SplashScreen} options={{
        headerShown:false
      }}/>
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          headerShown: true,
          title: 'Select Language',
          headerBackVisible:false,
          headerShadowVisible:false,
          statusBarColor:'white',
          headerTitleAlign:'center',

          headerTitleStyle:{
            fontSize:20,
            fontWeight:'700',
            fontFamily:fonts.Bold
            // color: '#3972FE',
            
          }
        }}
        
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          title: 'Privacy Policy',
          headerShadowVisible:false,
        }}
      />
      <Stack.Screen name="onboarding" component={OnboardingScreen}  options={{
          headerShadowVisible:false,
          headerShown:false,
          title:'On boarding'
        }} />
    </Stack.Navigator>
  );
}
export default AuthStack;
