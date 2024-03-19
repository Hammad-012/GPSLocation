import notifee,{EventType} from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import 'react-native-gesture-handler';
import MainApp from './App'
import { name as appName } from './app.json';
import getDistance from './src/logic/getDistance';
import { updateLocationAlertItem } from './src/store/actions/locationAlertAction';
import { store } from './src/store/store';

notifee.registerForegroundService(notification => {
    let watchId = null;
    let state = null;
    store.subscribe(listener);
    function listener() {
      state = store.getState().locationAlertReducer;
    }
    return new Promise((resolve, reject) => {
      watchId = Geolocation.watchPosition(
        position => {
          if (state && state.alerts.length > 0) {
            state.alerts.map((item, index) => {
              getDistance({
                from: {lat: item.coords.latitude, lng: item.coords.longitude},
                to: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              }).then(distance => {
                if (parseInt(distance * 1000) < item.radius) {
                  if (!item.is_notification) {
                    store.dispatch(
                      updateLocationAlertItem({
                        index: index,
                        is_in_radius: true,
                        is_notification: true,
                      }),
                    );
                    onDisplayNotification(item, distance, 'Close');
                  }
                } else {
                  if (item.is_notification) {
                    onDisplayNotification(item, distance, 'Away');
                  }
                  store.dispatch(
                    updateLocationAlertItem({
                      index: index,
                      is_in_radius: false,
                      is_notification: false,
                    }),
                  );
                 
                }
              });
            });
          }
        },
        error => {},
        {
          distanceFilter: 10,
          forceLocationManager: true,
          forceRequestLocation: true,
          enableHighAccuracy: false,
          interval: 5000,
          fastestInterval: 2000,
          accuracy: {
            android: 'low',
            ios: 'bestForNavigation',
          },
          timeout: 2500,
          showsBackgroundLocationIndicator: true,
        },
      );
  
      const unsubscribe = notifee.onForegroundEvent(async ({type, detail}) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
          Geolocation.clearWatch(watchId);
          await notifee.stopForegroundService();
          unsubscribe();
          resolve();
        }
      });
    });
  });
  
  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;
  
    if (type === EventType.ACTION_PRESS && pressAction.id === 'stop') {
      Geolocation.clearWatch(watchId);
      await notifee.stopForegroundService();
    }
  });
  
  const onDisplayNotification = async (item, distance, message) => {
    try {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      await notifee.displayNotification({
        title: `You are getting ${message} to ${item.name}`,
        body: `you are ${distance} km away form ${item.name}`,
        android: {
          channelId,
          actions: [
            {
              title: 'Close',
              pressAction: {
                id: 'stop',
              },
            },
          ],
  
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (e) {
      console.error(e, 'ERRORORORORORORO');
    }
  };
  
  AppRegistry.registerComponent(appName,  () => MainApp);