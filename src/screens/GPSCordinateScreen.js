import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Button,
  ImageBackground,
  TextInput,
  Platform,
  TouchableNativeFeedback
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapIcon from '../assests/svgs/Map.png';
import LeftArrowIcon from '../assests/svgs/leftarrowIcon.svg';
import HistoryIcon from '../assests/svgs/HistoryIcon.svg';
import HistoryIcon2 from '../assests/svgs/HistoryIcon2.svg';
import MapLayer from '../assests/svgs/MapLayer.svg';
import FullScreen from '../assests/svgs/fullscreen.svg';
import fonts from '../constants/font';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import NavigationIcon from '../assests/svgs/navigation.svg';
import PlusIcon from '../assests/svgs/PlusIcon.svg';
import MinusIcon from '../assests/svgs/MinusIcon.svg';
import CurrentLocation from '../assests/svgs/currentLocationIcon.svg';
import ShareIcon from '../assests/svgs/Share1.svg';
import CopyIcon from '../assests/svgs/Copy1.svg';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import LocationPin from '../assests/svgs/Locationpin.svg';
const GPSCordinateScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setinittialRoute('gpscordinatescreen'));
  }, []);
  const MapRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [markerLocation, setMarkerLocation] = useState(null);
  const [title, setTitle] = useState('Rawalpindi');
  const initialLatitude = currentLocation.latitude.toString();
  const initialLongitude = currentLocation.longitude.toString();
  const [inputLatitude, setInputLatitude] = useState(initialLatitude);
  const [inputLongitude, setInputLongitude] = useState(initialLongitude);
  const [coordinatesEdited, setCoordinatesEdited] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(15);
  const handleTrafficLayer = () => {
    if (selectedLayer === 'satellite') {
      setSelectedLayer('standard');
    } else {
      setSelectedLayer('satellite');
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
          _animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setMarkerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    };
    getLocation();
  }, []);

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

  const onZoomInPress = () => {
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.getCamera().then((cam) => {
        cam.zoom += 1;
        currentMap.animateCamera(cam);
      });
    }
  };
  const onZoomoutPress = () => {
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.getCamera().then((cam) => {
        cam.zoom -= 1;
        currentMap.animateCamera(cam);
      });
    }
  };


  const handleGetLocation = () => {
    const latitude = parseFloat(inputLatitude);
    const longitude = parseFloat(inputLongitude);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setMarkerLocation({latitude, longitude});
      setCurrentLocation({latitude, longitude});
      getAddress({lat: latitude, lng: longitude});
    } else {
      console.error('Invalid latitude or longitude');
    }
  };
  const handleMarkerPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setInputLatitude(latitude.toString()); 
    setInputLongitude(longitude.toString());
    setCoordinatesEdited(true);
    
    getAddress({ lat: latitude, lng: longitude }); 
  };
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude }); 
    setInputLatitude(latitude.toString()); 
    setInputLongitude(longitude.toString()); 
    getAddress({ lat: latitude, lng: longitude }); 
  };
  const _animateMapToRegion = (Location) => {
    const { latitude, longitude } = Location;
    const newRegion = {
      latitude:latitude,
      longitude:longitude,
      latitudeDelta: 0.015  ,
      longitudeDelta: 0.0121 ,
    };
    setInputLatitude(latitude.toString()); 
    setInputLongitude(longitude.toString());
    MapRef.current.animateToRegion(newRegion, 1000);
  };
  const addressLines = title.split(',');
  const firstLine = addressLines.slice(0, 5).join(',');
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <MapView
            ref={MapRef}
            provider={'google'}
            style={styles.map}
            zoomEnabled={true}
            mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
            onPress={handleMapPress}
            
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.015 * zoomLevel,
              longitudeDelta: 0.0121 * zoomLevel,
            }}
           >
           {markerLocation && (
        <Marker coordinate={markerLocation} onPress={handleMarkerPress}>
        <LocationPin width={40} height={40} />
      </Marker>
      )}
          </MapView>
          <View style={{position: 'absolute', top: hp('30%'), right: 5}}>
            {/* <TouchableOpacity onPress={handleTrafficLayer}>
        <MapLayer width={60} height={60} />
        </TouchableOpacity> */}
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            ...Platform.select({
              ios: {
                marginTop: 50,
              },
            }),
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
            <LeftArrowIcon
              width={70}
              height={70}
              style={styles.LeftArrowIcon}
            />
          </TouchableOpacity>
          <View style={{left: 80, marginTop: 25}}>
            <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
              GPS{' '}
              <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
                Cordinate
              </Text>
            </Text>
          </View>
        </View>
        {/* Location pin icon */}
        {/* <View style={{position:'absolute',alignSelf:'center',top:hp(40),gap:10}}>
              <LocationPin />
          </View> */}
        {/* icons */}
        <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-end',
          top: hp(30),
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
        <TouchableOpacity onPress={handleTrafficLayer} >
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
            MapRef.current.animateToRegion({
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
      </View>
        <View style={styles.BottomContainer}>
          <View>
            <Text style={{textAlign: 'center', marginTop: 10}}>{firstLine}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 15,
              columnGap: 10,
              marginTop: 20,
            }}>
            <View
              style={{
                width: '50%',
                height: 60,
                borderRadius: 12,
              }}>
              <TextInput
                style={styles.input}
                placeholder="Enter latitude"
                onChangeText={text => {
                  setInputLatitude(text);
                  setCoordinatesEdited(true);
                }}
                value={inputLatitude}
                keyboardType="numeric"
              />
            </View>
            <View
              style={{
                width: '50%',
                height: 60,
                borderRadius: 12,
              }}>
              <TextInput
                style={styles.input}
                placeholder="Enter longitude"
                onChangeText={text => {
                  setInputLongitude(text);
                  setCoordinatesEdited(true);
                }}
                value={inputLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>
          {coordinatesEdited && (
            <TouchableOpacity
              onPress={handleGetLocation}
              style={{
                backgroundColor: '#3972FE',
                width: '90%',
                height: 50,
                borderRadius: 5,
                marginLeft: 18,
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 10,
              }}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: fonts.Bold,
                  fontWeight: '500',
                }}>
                Get Location
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default GPSCordinateScreen;

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
  LeftArrowIcon: {
    position: 'absolute',
  },
  RefreshIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  BottomContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    borderRadius: 15,
    width: wp('100%'),
    height: hp('25%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.24,
    shadowRadius: 10,
  },
  TextContainer: {
    textAlign: 'center',
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: '#F9F9F9',
    width: wp('100%'),
    height: hp('30%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
  },
  NavigationIcon: {
    alignSelf: 'center',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#F9F9F9',
    width: wp('30%'),
    height: hp('7%'),
    borderRadius: 8,
  },
  buttonText: {
    color: '#1E1F4B',
    fontSize: 8,
    fontWeight: '700',
    justifyContent: 'center',
  },
  HideContainer: {
    backgroundColor: '#fff',
    width: wp('90%'),
    height: hp('50%'),
    shadowColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
    },
  },
  cordinatesContainer: {
    backgroundColor: 'red',
    width: '50%',
    height: 60,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingLeft: 10,
  },
  CurrentLocation:{
    justifyContent:'center',
      alignItems:'center',
      marginLeft:2,
      bottom:2
  },
  PlusIcon:{
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
  maplayer:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:2,
    marginTop:2
},
});
