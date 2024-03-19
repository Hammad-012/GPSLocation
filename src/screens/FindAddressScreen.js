import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LeftArrowIcon from '../assests/svgs/leftarrowIcon.svg';
import MapLayer from '../assests/svgs/MapLayer.svg';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import NavigationIcon from '../assests/svgs/navigation.svg';
import PlusIcon from '../assests/svgs/PlusIcon.svg';
import MinusIcon from '../assests/svgs/MinusIcon.svg';
import CurrentLocation from '../assests/svgs/currentLocationIcon.svg';
import ShareIcon from '../assests/svgs/Share1.svg';
import CopyIcon from '../assests/svgs/Copy1.svg';
import {useDispatch} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Clipboard from '@react-native-clipboard/clipboard';
import LocationPin from '../assests/svgs/Locationpin.svg';
const FindAddressScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const MapRef = useRef(null);
  useEffect(() => {
    dispatch(setinittialRoute('findaddress'));
  }, []);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [title, setTitle] = useState('Rawalpindi');

  console.log(title);
  const handleLayer = () => {
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
          console.log('GDGDGDGDGDG', position);
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          _animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
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
      currentMap.getCamera().then(cam => {
        cam.zoom += 1;
        currentMap.animateCamera(cam);
      });
    }
  };
  const onZoomoutPress = () => {
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.getCamera().then(cam => {
        cam.zoom -= 1;
        currentMap.animateCamera(cam);
      });
    }
  };

  const copyCoordinates = () => {
    const {latitude, longitude} = currentLocation;
    const coordinate = `${latitude}, ${longitude}`;
    console.log(coordinate);

    Clipboard.setString(coordinate);
  };
  const handleMarkerPress = event => {
    console.log('hellof');
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setMarkerLocation({latitude, longitude});
    getAddress({lat: latitude, lng: longitude});
  };
  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setMarkerLocation({latitude, longitude});
    getAddress({lat: latitude, lng: longitude});
  };
  const _animateMapToRegion = Location => {
    const {latitude, longitude} = Location;
    const newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    if (MapRef.current) {
      MapRef.current.animateToRegion(newRegion, 1000); // Ensure MapRef.current is not null before calling animateToRegion
    }
  };

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
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            onPress={handleMapPress}>
            <Marker coordinate={markerLocation} onPress={handleMarkerPress}>
              <LocationPin width={40} height={40} />
            </Marker>
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
              Find{' '}
              <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
                Address
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
            top: hp(50),
            right: 30,
          }}>
          <TouchableOpacity onPress={onZoomInPress}>
            <View
              style={{
                position: 'absolute',
                right: wp('-5%'),
                // marginTop:60,
                // // top: hp('53%'),
                backgroundColor: '#fff',
                elevation: 10,
                ...Platform.select({
                  ios: {
                    width: wp(12),
                    height: hp(5),
                  },
                  android: {
                    width: wp(12),
                    height: hp(5.5),
                  },
                }),
                borderRadius: 10,
              }}>
              <PlusIcon width={40} height={40} style={styles.PlusIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onZoomoutPress}>
            <View
              style={{
                position: 'absolute',
                right: wp('-5%'),
                // marginTop:60,
                top: hp('7%'),
                backgroundColor: '#fff',
                elevation: 10,
                ...Platform.select({
                  ios: {
                    width: wp(12),
                    height: hp(5),
                  },
                  android: {
                    width: wp(12),
                    height: hp(5.5),
                  },
                }),
                borderRadius: 10,
              }}>
              <MinusIcon width={40} height={40} style={styles.MinusIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLayer}>
            <View
              style={{
                position: 'absolute',
                right: wp('-5%'),
                top: hp('14%'),
                backgroundColor: '#fff',
                elevation: 10,
                ...Platform.select({
                  ios: {
                    width: wp(12),
                    height: hp(5),
                  },
                  android: {
                    width: wp(12),
                    height: hp(5.5),
                  },
                }),
                borderRadius: 10,
              }}>
              <MapLayer width={40} height={40} style={styles.maplayer} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              MapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }}>
            <View
              style={{
                position: 'absolute',
                right: wp('-5%'),
                top: hp('21%'),
                backgroundColor: '#fff',
                elevation: 10,
                ...Platform.select({
                  ios: {
                    width: wp(12),
                    height: hp(5),
                  },
                  android: {
                    width: wp(12),
                    height: hp(5.5),
                  },
                }),
                borderRadius: 10,
              }}>
              <CurrentLocation
                width={40}
                height={40}
                style={styles.CurrentLocation}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={copyCoordinates}>
            <View
              style={{
                position: 'absolute',
                right: wp('-5%'),
                top: hp('28%'),

                evation: 10,
                backgroundColor: '#fff',

                ...Platform.select({
                  ios: {
                    width: wp(12),
                    height: hp(5),
                  },
                  android: {
                    width: wp(12),
                    height: hp(5.5),
                  },
                }),
                borderRadius: 10,
              }}>
              <CopyIcon width={40} height={40} style={styles.CopyIcon} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.BottomContainer}>
          <View style={styles.TextContainer}>
            <Text
              style={{
                ...Platform.select({
                  ios: {marginTop: 15},
                  android: {marginTop: 10},
                }),
                width: wp(60),
                paddingLeft: 5,
              }}
              ellipsizeMode={'tail'}
              numberOfLines={2}>
              {title}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#3972FE',
              width: wp('30%'),
              height: hp('7.3%'),
              borderRadius: 8,
              alignSelf: 'flex-end',
              justifyContent: 'center',
              alignItems: 'center',
              left: 32,
              bottom: 66,
            }}>
            <NavigationIcon style={styles.NavigationIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default FindAddressScreen;

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
    bottom: 0,
    borderRadius: 15,
    width: wp('90%'),
    height: hp('15%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.24,
    shadowRadius: 10,
  },
  TextContainer: {
    margin: 10,
    textAlign: 'center',
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: '#F9F9F9',
    width: wp('95%'),
    height: hp('7.3%'),
    shadowOffset: {
      width: 0,
    },
    shadowColor: 'black',
  },
  NavigationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  CurrentLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    bottom: 2,
  },
  PlusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: 2,
  },
  MinusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: 2,
  },
  maplayer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: 2,
  },
  CopyIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: 2,
  },
});
