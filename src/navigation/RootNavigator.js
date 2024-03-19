import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
import MainStack from './MainStack';
const RootStackNavigator = () => {
  const {is_home_screen} = useSelector(state => state.userReducer);
  console.log(is_home_screen);
  return (
    <NavigationContainer>
      {is_home_screen ? <MainStack /> : <AuthStack />}
      
    </NavigationContainer>
  );
};

export default RootStackNavigator;