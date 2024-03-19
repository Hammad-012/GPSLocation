import React from 'react';
import {ToastProvider} from 'react-native-toast-notifications';
import RootStackNavigator from './src/navigation/RootNavigator';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import { SafeAreaView ,StyleSheet} from 'react-native';
import CustomStatusBar from './src/components/CustomStatusBar';
import SystemNavigationBar from 'react-native-system-navigation-bar';
const THEME_COLOR = '#fff';
const App = () => {
  if(Platform.OS ==='android') {
    SystemNavigationBar.stickyImmersive()
   }
   else{
    console.log('Cannot hide navigation');
   }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
            <CustomStatusBar backgroundColor={THEME_COLOR} barStyle="dark-content" />
          <RootStackNavigator />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
const styles = StyleSheet.create({
  bottomSafeArea: {
    flex: 1, 
    backgroundColor: THEME_COLOR
},
})