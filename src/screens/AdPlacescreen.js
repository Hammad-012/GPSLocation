import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Button,
  FlatList,
  Alert,
} from 'react-native';
import notifee from '@notifee/react-native';
import moment from 'moment';
import React, {useEffect, useState,useRef} from 'react';
import LeftArrowIcon from '../assests/svgs/leftarrowIcon.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PlusIcon from '../assests/svgs/PlusIcon.svg';
import MinusIcon from '../assests/svgs/MinusIcon.svg';
import CurrentLocation from '../assests/svgs/currentLocationIcon.svg';
import FullScreen from '../assests/svgs/fullscreen.svg';
import Slider from '@react-native-community/slider';
import fonts from '../constants/font';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import {useDispatch,useSelector} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker} from 'react-native-maps';
import {Circle} from 'react-native-maps';
import LocationPin from '../assests/svgs/Locationpin.svg'
import { addLocationAlert } from '../store/actions/locationAlertAction';
import { setLocation } from '../store/actions/userAction';
import LottieView from 'lottie-react-native';
import MapLayer from '../assests/svgs/MapLayer.svg';
const AdPlacescreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setinittialRoute('adplacescreen'));
  }, []);
  const navigation = useNavigation();
  const {selectedLanguage} = useSelector(state=>state.languageReducer)
  const [isEnabledinside, setIsEnabledinside] = useState(false);
  const [isEnabledoutside, setIsEnabledoutside] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  // const [circleRadius, setCircleRadius] = useState(0);
  // const [sliderValue, setSliderValue] = useState(0.5);
  // const [searchInput,setSearchInput] = useState('');
  const {location} = useSelector(state => state.userReducer);
  console.log('location in adplace screen',location);
  // console.log('location in adplace screen',location);
  const [locationAlert, setLocationAlert] = useState({
    id: '',
    name: '',
    radius: 200,
    is_notification: false,
    is_in_radius: false,
    arrival_time: null,
    exit_time: null,
    is_notify_on_arrival: true,
    is_notify_on_exit: true,
    active: true,
    unit: 'M',
  });
  const [markerLocation, setMarketLocation] = useState({
    latitude: location.coords.latitude ? location.coords.latitude : 0,
    longitude: location.coords.longitude ? location.coords.longitude : 0,
  });

  const mapViewRef = useRef(null);

  const AddPlaceToList = () => {
    if (locationAlert.name.trim() !== '') {
      dispatch(
        addLocationAlert({
          ...locationAlert,
          coords: markerLocation,
          radius: locationAlert.radius,
          timestamp: moment().unix(),
        }),
      )
        .then(data => {
          Alert.alert('Station Added', 'Your Station is Added successfully', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate(AuthRoutes.stationalert);
              },
            },
          ]);
          if (locationAlert.is_notify_on_arrival) {
            // Show notification for moving inside
            onDisplayNotification(true);
          }
          if (locationAlert.is_notify_on_exit) {
            // Show notification for moving outside
            onDisplayNotification(false);
          }
        })
        .catch(err => {});
    } else {
      alert('Please enter a place name');
    }
  };
  async function onDisplayNotification() {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: `Location  tracking ${locationAlert.name}`,
      body: `you reach in radius    ${
        locationAlert.radius > 1000
          ? parseFloat(locationAlert.radius / 1000).toFixed(2)
          : locationAlert.radius
      },
      ${locationAlert.radius > 1000 ? 'Km' : 'm'} , will recieve an alaram`,
      title: `Location tracking ${locationAlert.name}`,
      body: `You are ${
        locationAlert.is_notify_on_arrival ? 'moving inside' : 'moving outside'
      } the specified radius.`,
      android: {
        channelId,
        actions: [
          {
            title: 'Stop',
            pressAction: {
              id: 'stop',
            },
          },
          
        ],
        asForegroundService: true,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const toggleSwitchinside = () => {
    setIsEnabledinside(previousState => !previousState);
    setLocationAlert(prevState => ({
      ...prevState,
      is_notify_on_arrival: !prevState.is_notify_on_arrival,
    }));
  };


  const toggleSwitchoutside = () => {
    setIsEnabledoutside(previousState => !previousState);
    setLocationAlert(prevState => ({
      ...prevState,
      is_notify_on_exit: !prevState.is_notify_on_exit,
    }));
  };
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [title, setTitle] = useState('Rawalpindi');
  const [zoomLevel, setZoomLevel] = useState(15);
  // const [markerCoordinate, setMarkerCoordinate] = useState({
  //   latitude: currentLocation.latitude,
  //   longitude: currentLocation.longitude,
  // });
  const handleLayer = () => {
    
    if (selectedLayer === 'satellite') {
      setSelectedLayer('standard');
    } else {
      setSelectedLayer('satellite');
    }
  };

  const onZoomInPress = () => {
    const currentMap = mapViewRef.current;
    if (currentMap) {
      currentMap.getCamera().then((cam) => {
        cam.zoom += 1;
        currentMap.animateCamera(cam);
      });
    }
  };
  const onZoomoutPress = () => {
    const currentMap = mapViewRef.current;
    if (currentMap) {
      currentMap.getCamera().then((cam) => {
        cam.zoom -= 1;
        currentMap.animateCamera(cam);
      });
    }
  };


  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          dispatch(setLocation(position))
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    };
    getLocation();
  }, []);

  // const handleMapPress = event => {
  //   const {latitude, longitude} = event.nativeEvent.coordinate;
  //   setMarkerCoordinate({latitude, longitude});
  // };
  const getAddress = ({lat, lng}) => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1&accept-language=en`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setTitle(result.display_name);
      })
      .catch(error => console.error(error));
  };
 
  
  const handleSliderChange = value => {
    setSliderValue(value);
    setCircleRadius(value * 10000);
  };
  const animateMapToRegion = (location) => {
      const {latitude,longitude} = location;
      const newRegion = {
        latitude:latitude,
        longitude:longitude,
        latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
      }
      mapViewRef.current.animateToRegion(newRegion,1000)
  }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
      <MapView
          ref={mapViewRef}
          style={styles.map}
          mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
          onPress={event => {
            setMarketLocation({
              latitude: event.nativeEvent.coordinate.latitude,
              longitude: event.nativeEvent.coordinate.longitude,
            });
          }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05 * zoomLevel,
            longitudeDelta: 0.05 * zoomLevel,
          }}
          
          zoomEnabled={true}
          provider={'google'}
          radius={locationAlert.radius}
          showsMyLocationButton={false}
          showsUserLocation={true}
          moveOnMarkerPress={false}
          showsCompass={true}>
          <Marker coordinate={markerLocation}>
            <LocationPin
              width={40}
              height={40}
            />
          </Marker>
          <Circle
            center={markerLocation}
            strokeColor={'green'}
            strokeWidth={2}
            fillColor={'rgba(112, 193, 103,.4)'}
            radius={locationAlert.radius}
          />
        </MapView>
      </View>
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          ...Platform.select({
            ios: {
              marginTop: 50,
            },
            android: {
              marginTop: 20,
            },
          }),
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(AuthRoutes.stationalert)}>
          <LeftArrowIcon width={70} height={70} style={styles.LeftArrowIcon} />
        </TouchableOpacity>
        <View style={{marginTop: 24}}>
          <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
            Station{' '}
            <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
              Alert
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-end',
          top: hp(20),
          right: 30,
        }}>
       <TouchableOpacity onPress={onZoomInPress} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
              // marginTop:60,
              // // top: hp('53%'),
              backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <PlusIcon width={40} height={40} style={styles.PlusIcon}  />
            </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={onZoomoutPress} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
              // marginTop:60,
              top: hp('7%'),
              backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <MinusIcon width={40} height={40} style={styles.MinusIcon} />
            </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={handleLayer} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
             top: hp('14%'),
             backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <MapLayer width={40} height={40} style={styles.maplayer} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            mapViewRef.current.animateToRegion({
              latitude:currentLocation.latitude,
              longitude:currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            })
          }} >
            <View
             style={{
              position: 'absolute',
              right: wp('-5%'),
             top: hp('21%'),
              backgroundColor:'#fff',
              elevation:10,
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
              <CurrentLocation width={40} height={40} style={styles.CurrentLocation} />
            </View>
          </TouchableOpacity>
       <TouchableOpacity onPress={()=>setIsFullScreen(!isFullScreen)}>
          <View
            style={{
              position: 'absolute',
              right: wp('-5%'),
              top: hp('28%'),
             
              evation:10,
              backgroundColor:'#fff',
             
             ...Platform.select({
              ios:{
                width:wp(12),
              height:hp(5),
              },
              android:{
                width:wp(12),
              height:hp(5.5),
              }
                 }),
              borderRadius:10
            }}>
            <FullScreen width={40} height={40} style={styles.FullScreen} />
          </View>
          </TouchableOpacity>
      </View>
      <View style={styles.sheetContainer}>
      <TextInput
      
            placeholder={'Enter place name'}
            placeholderTextColor={'#0004'}
            value={locationAlert.name}
            keyboardType={'default'}
            returnKeyType={'done'}
            onChangeText={text =>
              setLocationAlert({...locationAlert, name: text})
            }
            style={styles.input}
          />
        <Text style={{color: '#3972FE', marginLeft: 23}}>Area</Text>
        <Slider
          style={{
            width: '90%',
            height: 30,
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#3972FE"
          maximumTrackTintColor="#3972FE"
          thumbTintColor="#3972FE"
          thumbStyle={{width: 20, height: 20}}
          value={locationAlert.radius}
          onValueChange={text => {
            setLocationAlert({
              ...locationAlert,
              radius: text,
            });
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
          }}>
          <Text style={{color: '#3972FE', margin: 10}}>{selectedLanguage.Move_outside}</Text>
          <Switch
            trackColor={{false: '#767577', true: 'green'}}
            thumbColor={isEnabledinside ? '#E8F5E9' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchoutside}
            value={locationAlert.is_notify_on_exit}
            style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
          }}>
          <Text style={{color: '#3972FE', margin: 10}}>{selectedLanguage.Move_inside}</Text>
          <Switch
            trackColor={{false: '#767577', true: 'green'}}
            thumbColor={isEnabledoutside ? '#E8F5E9' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchinside}
            value={locationAlert.is_notify_on_arrival}
            style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
          />
        </View>
        <TouchableOpacity
          style={{
            justifyContent:'center',
            alignItems:'center',
            backgroundColor: '#3972FE',
            width: '90%',
            height: 50,
            borderRadius: 10,
            alignSelf: 'center',
          }}
          onPress={() => AddPlaceToList()}>
          <Text
            style={{
              color: '#fff',
              fontFamily: fonts.Bold,
              fontWeight: '500',
              textAlign: 'center',
              fontSize: 14,
              justifyContent:'center',
              alignItems:'center'
            }}>
            {selectedLanguage.Add_place}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdPlacescreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    width: '90%',
    borderRadius: 10,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingLeft: 12,
    backgroundColor: '#f9f9f9',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('43%'),
    borderRadius: 10,
    elevation:10
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  LeftArrowIcon:{
    elevation:10
  },
  maplayer:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:2,
    marginTop:2
},
FullScreen:{
  justifyContent:'center',
  alignItems:'center',
  marginLeft:2,
  marginTop:2
},
MinusIcon:{
  justifyContent:'center',
    alignItems:'center',
    marginLeft:2,
    marginTop:2
},
CurrentLocation:{
  justifyContent:'center',
    alignItems:'center',
    marginLeft:2,
},
PlusIcon:{
  justifyContent:'center',
    alignItems:'center',
    marginLeft:2,
    marginTop:2
}
});
