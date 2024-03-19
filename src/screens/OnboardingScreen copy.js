import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CircleIcon from '../assests/svgs/Circle.svg';

import CurvePath from '../assests/svgs/curvepath.png';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import Geolocation from '@react-native-community/geolocation';
import {setHomeScreen, setLocation} from '../store/actions/userAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import fonts from '../constants/font';
import Onboarding from '../components/Onboarding';
const Simple = () => {
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const dispatch = useDispatch();
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    dispatch(setinittialRoute('onboarding'));
  }, []);
  const navigation = useNavigation();
  const [isEnabledLocation, setIsEnabledLocation] = useState(false);
  const [isEnabledContact, setIsEnabledContact] = useState(false);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);
  const [isContactPermissionGranted, setIsContactPermissionGranted] =
    useState(false);
  useEffect(() => {
    const checkPermissionStatus = async () => {
      const status = await AsyncStorage.getItem('locationPermission');
      console.log('location status', status);
      setIsLocationPermissionGranted(status === 'granted');

      const contactStatus = await AsyncStorage.getItem('contactPermission');
      console.log('contact status', contactStatus);
      setIsContactPermissionGranted(contactStatus === 'granted');
      if (status === 'granted' && contactStatus === 'granted') {
        navigateToMainScreen();
      }
    };

    checkPermissionStatus();
  }, []);

  const toggleSwitch = async () => {
    if (!isLocationPermissionGranted) {
      setIsEnabledLocation(previousState => !previousState);
      requestLocationPermission();
      await AsyncStorage.setItem('locationPermission', 'granted');
    } else {
      navigateToMainScreen();
    }
  };

  const toggleSwitchContact = async () => {
    if (!isContactPermissionGranted) {
      setIsEnabledContact(previousState => !previousState);
      requestContactPermission();
      await AsyncStorage.setItem('contactPermission', 'granted');
    } else {
      navigateToMainScreen();
    }
  };

  const requestLocationPermission = () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        setIsLocationPermissionGranted(result === 'granted');
        if (result === 'granted') {
          AsyncStorage.setItem('locationPermission', 'granted');
        }
      });
    } else {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(resultFine => {
        if (resultFine === 'granted') {
          setIsLocationPermissionGranted(true);
          AsyncStorage.setItem('locationPermission', 'granted');
        } else {
          request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
            resultCoarse => {
              setIsLocationPermissionGranted(resultCoarse === 'granted');
              if (resultCoarse === 'granted') {
                AsyncStorage.setItem('locationPermission', 'granted');
              }
            },
          );
        }
      });
    }
  };
  useEffect(() => {
    if (isLocationPermissionGranted) {
      Geolocation.getCurrentPosition(
        position => {
          console.log('onbaording', position);
          dispatch(setLocation(position));
          //  setUserLocation({
          //   latitude:position.coords.latitude,
          //   longitude:position.coords.longitude
          //  })
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    }
  }, [isLocationPermissionGranted]);

  const requestContactPermission = () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CONTACTS).then(result => {
        setIsContactPermissionGranted(result === 'granted');
        console.log('result in if condition', result);
      });
    } else {
      request(PERMISSIONS.ANDROID.READ_CONTACTS).then(result => {
        setIsContactPermissionGranted(result === 'granted');
        console.log('result in else condition', result);
      });
    }
  };
  useEffect(() => {
    const checkPermissionStatus = async () => {
      const status = await AsyncStorage.getItem('locationPermission');
      setIsLocationPermissionGranted(status === 'granted');

      const contactStatus = await AsyncStorage.getItem('contactPermission');
      setIsContactPermissionGranted(contactStatus === 'granted');

      // If both permissions are granted, navigate to the main screen
      if (status === 'granted' && contactStatus === 'granted') {
        navigateToMainScreen();
      }
      else{
        
      }
    };
      
    checkPermissionStatus();
  }, []);

  const checkPermissionsAndNavigate = () => {
    // If both permissions are granted, navigate to the main screen
    if (isLocationPermissionGranted && isContactPermissionGranted) {
      navigateToMainScreen();
    }
  };

  const navigateToMainScreen = () => {
    dispatch(setHomeScreen(true));
    // navigation.navigate(AuthRoutes.MainScreen);
  };

  const CustomButton = ({label, onPress}) => (
    <TouchableOpacity style={{marginHorizontal: 6}} onPress={onPress}>
      <CircleIcon />
      <Icon
        name="arrow-forward-outline"
        size={25}
        color="white"
        style={styles.ArrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <Onboarding
      showSkip={true}
      skipToPage={0}
      onDone={checkPermissionsAndNavigate}
      bottomBarHighlight={false}
      NextButtonComponent={CustomButton}
      DoneButtonComponent={CustomButton}
      showNext={true}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                bottom: hp(23),
              }}>
              <Image
                source={require('../assests/images/GPSTracker1.png')}
                style={{height: hp(50), width: wp(75)}}
              />
            </View>
          ),
          title: (
            <Text style={{position: 'absolute', top: hp(50), marginTop: 15}}>
              <Text
                style={{color: '#3972FE', fontWeight: 'bold', fontSize: 26}}>
                GPS
              </Text>
              <Text
                style={{color: '#1E1F4B', fontWeight: 'bold', fontSize: 26}}>
                {' '}
                Tracker
              </Text>
            </Text>
          ),
          subtitle: (
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 14,
                fontFamily: fonts.Medium,
                fontWeight: '500',
                position: 'absolute',
                top: hp(53),
                textAlign: 'center',
                margin: 12,
              }}
              ellipsizeMode={'middle'}>
              {selectedLanguage.GPSTracker_real_time_location}
            </Text>
          ),
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assests/images/stationalert.png')}
              style={{
                height: hp('40%'),
                width: wp('66.5%'),
                position: 'absolute',
                bottom: hp(5),
              }}
            />
          ),
          title: (
            <Text style={{position: 'absolute', top: hp(50)}}>
              <Text
                style={{color: '#3972FE', fontWeight: 'bold', fontSize: 26}}>
                Station
              </Text>
              <Text
                style={{color: '#1E1F4B', fontWeight: 'bold', fontSize: 26}}>
                {' '}
                Alert
              </Text>
            </Text>
          ),
          subtitle: (
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 12,
                margin: 12,
                fontWeight: '500',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'absolute',
                top: hp(53),
                marginTop: 10,
                fontFamily: fonts.Medium,
              }}>
              {selectedLanguage.Noftify_you}
              {'\n'}
              <Text style={{textAlign: 'center'}}></Text>
            </Text>
          ),
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              resizeMode={'center'}
              source={require('../assests/images/numbertracker.png')}
              style={{
                height: hp('35%'),
                width: wp('70%'),
                position: 'relative',
                top: -120,
                alignSelf: 'center',
                marginLeft: 50,
              }}
            />
          ),
          title: (
            <Text style={{position: 'relative', top: -111}}>
              <Text
                style={{color: '#3972FE', fontWeight: 'bold', fontSize: 26}}>
                Number
              </Text>
              <Text
                style={{color: '#1E1F4B', fontWeight: 'bold', fontSize: 26}}>
                {' '}
                Tracker
              </Text>
            </Text>
          ),
          subtitle: (
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 12,
                margin: 12,
                fontWeight: '500',
                position: 'relative',
                top: -118,
                textAlign: 'center',
                marginTop: 10,
                fontFamily: fonts.Medium,
              }}>
              {selectedLanguage.Got_Number_Details}
              {'\n'}
            </Text>
          ),
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assests/images/permission.png')}
              style={{
                height: hp('20%'),
                width: '70%',
                position: 'absolute',
                bottom: hp(30),
              }}
            />
          ),
          title: (
            <>
              <View style={styles.permissionContainer}>
                <Text style={styles.locationText}>
                  {selectedLanguage.Location}
                </Text>
                <Text
                  style={{
                    paddingLeft: 12,
                    color: '#1E1F4B',
                    fontSize: 16,
                    fontWeight: '700',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {selectedLanguage.Allow_permission}
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: 'green'}}
                  thumbColor={isEnabledLocation ? '#E8F5E9' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabledLocation}
                  style={{
                    alignSelf: 'flex-end',
                    position: 'relative',
                    top: -20,
                    marginRight: 10,
                  }}
                />
              </View>

              <View style={styles.permissionContainer1}>
                <Text style={styles.contactText}>
                  {selectedLanguage.Contact}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    paddingLeft: 12,
                    color: '#1E1F4B',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  {selectedLanguage.Allow_permission}
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: 'green'}}
                  thumbColor={isEnabledContact ? '#E8F5E9' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitchContact}
                  value={isEnabledContact}
                  style={{
                    alignSelf: 'flex-end',
                    position: 'relative',
                    top: -20,
                    marginRight: 10,
                  }}
                />
              </View>
            </>
          ),
          subtitle: <View></View>,
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  ArrowIcon: {
    position: 'absolute',
    top: 10,
    left: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    position: 'absolute',
    top: hp(25),
    backgroundColor: '#F9F9F9',
    width: '90%',
    height: 60,
    justifyContent: 'center',

    shadowColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  permissionContainer1: {
    position: 'absolute',
    top: hp(35),
    backgroundColor: '#F9F9F9',
    width: '90%',
    height: 60,
    justifyContent: 'center',
    shadowColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  locationText: {
    position: 'relative',
    bottom: 25,
    marginLeft: 10,
    color: '#1E1F4B',
    fontSize: 14,
  },
  contactText: {
    position: 'relative',
    bottom: 20,
    marginLeft: 10,
    color: '#1E1F4B',
    fontSize: 14,
  },
});
export default Simple;