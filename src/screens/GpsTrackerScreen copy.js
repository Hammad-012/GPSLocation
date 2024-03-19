import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  Permission,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LeftArrowIcon from '../assests/svgs/leftarrowIcon.svg';
import HistoryIcon from '../assests/svgs/history.svg';
import HistoryIcon2 from '../assests/svgs/HistoryIcon2.svg';
import MapLayer from '../assests/svgs/MapLayer.svg';
import FullScreen from '../assests/svgs/fullscreen.svg';
import fonts from '../constants/font';
import AvgSpeedIcon from '../assests/svgs/AvgSpeed.svg';
import PauseIcon from '../assests/svgs/Pause.svg';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import MapView, {Polyline, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';
import {addNewTrack} from '../store/actions/trackAction';
import checkPermission from '../logic/checkPermisson';
import getDistance from '../logic/getDistance';
import {useCountdown} from '../logic/countdown';
import {useLazySearchGeoCodingByLatLongQuery} from '../service/mapAPI';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
const initialState = {
  id: '1',
  name: '',
  date: '',
  time: '',
  start_address: '',
  end_address: '',
  distance: '0',
  duration: '0',
  avg_speed: '0',
  max_speed: '0',
  min_speed: '0',
  coordinates: [],
};
const GpsTrackerScreen = () => {
  const navigation = useNavigation();
  const deviceHeight = Dimensions.get('window').height;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setinittialRoute('GpsTracker'));
  }, []);
  const {selectedLanguage} = useSelector(state => state.languageReducer);
  const [location_route, setLocationRoute] = useState([]);
  const mapViewRef = useRef(null);
  const {location} = useSelector(state=>state.userReducer);
  ///console.log(location,'location from reducer');
  const {track} = useSelector(state => state.trackReducer);
  const [paused, setPaused] = useState(false);
  const [watchid, setWatchId] = useState(null);
  const [start, setStart] = useState(false);
  const [time_count, setCountDown] = useCountdown({start: start});
  const [track_record, setTrackRecord] = useState(initialState);
  const [saving_track, setSavingTrack] = useState(false);
  const [all_data_saved, setAlData_Saved] = useState(false);
  const [location_permission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [showtraffic, setShowTraffic] = useState(false);
  const [visibleButton, setShowVisiblebutton] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [title, setTitle] = useState('Rawalpindi');
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [searchGeoCodingByLatLong, data] = useLazySearchGeoCodingByLatLongQuery();

  useEffect(() => {
    if (data.isSuccess) {
      setTitle(data?.display_name);
    }
  }, [data]);

  const togglePaused = () => {
    setPaused(!paused);
  };

  ///
  useEffect(() => {
    checkPermission()
      .then(data => {
        setLocationPermission(false);
      })
      .catch(err => {
        setLocationPermission(true);
      });
  }, []);

  ////
  useEffect(() => {
    if (track_record.name != '') {
      setTrackRecord(prev => ({
        ...prev,
        duration: time_count,
      }));
    }
  }, [time_count]);
  ///
  useEffect(() => {
    if (all_data_saved && track_record.name !== '') {
      SaveTrackRecord().then(data => {
        Geolocation.clearWatch(watchid);
        setLocationRoute([]);
        setTrackRecord(initialState);
        setSavingTrack(false);
        setStart(false);
        setCountDown(0);
        setAlData_Saved(false);
      });
    }
  }, [track_record]);
  ////END TRACKING
  const EndTracking = () => {
    setSavingTrack(true);
    LocationfromCoords(
      currentLocation.latitude,
      currentLocation.longitude,
      false,
    );
  };

  const LocationfromCoords = (lat, lng, is_start) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1&accept-language=en`)
      .then(response => {
        console.log('DATA RESPONSE',response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        if (is_start) {
          setTrackRecord({...track_record, start_address: 'this is start'});
        } else {
          setTrackRecord({...track_record, end_address: 'this is end'});
        }
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
        // Handle error
        if (is_start) {
          setTrackRecord({...track_record, start_address: 'this is start'});
        } else {
          setTrackRecord({...track_record, end_address: 'this is end'});
        }
      });
  };
  const SaveTrackRecord = () => {
    return new Promise((resolve, reject) => {
      dispatch(addNewTrack(track_record));
      resolve();
    });
  };
  const watchUserPosition = () => {
    try {
      const watchID = Geolocation.watchPosition(
        position => {
          // console.log(position);
          if (!paused) {
            let coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            let temp = location_route;
            temp.push(coords);
            setLocationRoute(temp);
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            calculate_distance({
              too: position.coords,
              speed: position.coords.speed * 3.60934,
            });
          }
        },
        error => {
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: false,
          timeout: 150000,
          maximumAge: 1000,
          distanceFilter: 10,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
      setWatchId(watchID);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };
  const StartTracking = () => {
    setStart(true);
    setTrackRecord({
      ...track_record,
      name: `Track ${track.length + 1}`,
      date: moment().format('DD-MMM-YYYY'),
      time: moment().format('hh:mm'),
    });
    watchUserPosition();
    LocationfromCoords(
      currentLocation.latitude,
      currentLocation.longitude,
      true,
    );
  };

  const calculate_distance = ({too, speed}) => {
    getDistance({
      from: {lat: currentLocation.latitude, lng: currentLocation.longitude},
      to: {lat: too.latitude, lng: too.longitude},
    }).then(distance => {
      setTrackRecord(prev => ({
        ...prev,
        distance: parseFloat(distance).toFixed(2),
        max_speed: parseInt(speed),
        avg_speed: (parseInt(prev.avg_speed) + parseInt(speed)) / 2,
        duration: time_count,
      }));
    });
  };

  // Map Layer
  const handleTrafficLayer = () => {
    setShowTraffic(!showtraffic);
    if (selectedLayer === 'satellite') {
      setSelectedLayer('standard');
    } else {
      setSelectedLayer('satellite');
    }
  };

  ///Visible Button
  const handlevisibleButton = () => {
    setShowVisiblebutton(!visibleButton);
    if (!location_permission) {
      StartTracking();
    } else {
      setLocationPermission(false);
    }
  };

  ///toggle Modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (paused) {
      setPaused(false);
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
          _animateMapToregion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          getAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          searchGeoCodingByLatLong({
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

  const _animateMapToregion = (location) => {
      const {latitude,longitude} = location;
      const newRegion = {
        latitude:latitude,
        longitude:longitude,
        latitudeDelta: 0.015 ,
      longitudeDelta: 0.0121 
      }
      mapViewRef.current.animateToRegion(newRegion,1000)
  }
  const newLocal = <AvgSpeedIcon />;
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <MapView
            provider={'google'}
            style={[
              styles.map,
              { flex: isFullScreen ? 1 : 0.55 },
              isFullScreen && { height: '100%', width: '100%' } 
            ]}
            ref={mapViewRef}
            zoomEnabled={true}
            minZoomLevel={0}
            maxZoomLevel={4000}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.2,
              longitudeDelta: 0.05,
            }}
            mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
            >
            <Polyline
              coordinates={[...location_route]}
              strokeColor="#0090FF"
              strokeWidth={2}
            />
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              image={require('../assests/images/custompin.png')}
              title={title}
              style={{width: 100, height: 100}}
            />
          </MapView>
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
                Tracker
              </Text>
            </Text>
          </View>
        
          <View
            style={{
              position: 'absolute',
              right: wp('-72%'),
              top: hp('2%'),
              width:wp(12),
              height:hp(5),
              backgroundColor:'#fff',
              elevation:10,
              borderRadius:10
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(AuthRoutes.history)}
              >
              <HistoryIcon width={25} height={25} style={styles.history} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleTrafficLayer} >
            <View
             style={{
              position: 'absolute',
              right: wp('-72%'),
              top: hp('53%'),
              width:wp(12),
              height:hp(5),
              backgroundColor:'#fff',
              elevation:10,
              borderRadius:10
            }}>
              <MapLayer width={40} height={40} style={styles.maplayer} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setIsFullScreen(!isFullScreen)}>
          <View
            style={{
              position: 'absolute',
              right: wp('-72%'),
              top: hp('60%'),
             width:wp(12),
              height:hp(5),
              backgroundColor:'#fff',
              elevation:10,
              borderRadius:10
            }}>
            <FullScreen width={40} height={40} style={styles.FullScreen} />
          </View>
          </TouchableOpacity>
        </View>
        <View style={styles.BottomContainer}>
          <View style={styles.TextContainer}>
            <Text
              style={{
                fontFamily:fonts.Medium,
                fontSize:12,
                fontWeight:'500',
                color: '#1E1F4B',
                width: wp(60),
                paddingLeft: 5,
                margin:5
              }}
              ellipsizeMode={'tail'}
              numberOfLines={2}>
              {title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handlevisibleButton}
            style={{
              backgroundColor: '#3972FE',
              width: wp('30%'),
              height: hp('7.3%'),
              left:30,
              borderRadius: 8,
              bottom:hp(8.5),
              alignSelf: 'flex-end',
              justifyContent:'center',
              alignItems:'center'
            }}>
            <Text
              style={{
                textAlign: 'center',
                justifyContent:'center',
                alignItems:'center',
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                fontFamily: fonts.Bold,
              }}>
              {selectedLanguage.start}
            </Text>
          </TouchableOpacity>
          {visibleButton && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
                position: 'absolute',
                ...Platform.select({
                  ios: {
                    bottom: 130,
                  },
                  android: {
                    bottom: 110,
                  },
                }),
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity style={styles.button}>
                <Text style={{margin: 10, fontSize: 12, color: '#1E1F4B'}}>
                  Avg Speed
                </Text>
                <View style={{flexDirection: 'row', gap: 5, marginLeft: 20}}>
                  {/* <AvgSpeedIcon width={10} height={20} /> */}
                  <Text
                    style={{color: '#1E1F4B', fontSize: 14, fontWeight: '700'}}>
                    {track_record.avg_speed}km/hr
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={{margin: 10, fontSize: 12, color: '#1E1F4B'}}>
                  Max Speed
                </Text>
                <View style={{flexDirection: 'row', gap: 5, marginLeft: 20}}>
                  
                  <Text
                    style={{color: '#1E1F4B', fontSize: 14, fontWeight: '700'}}>
                    {track_record.max_speed}km/hr
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    justifyContent:'center',
                    alignItems:'center',
                   ...Platform.select({
                    ios:{
                      marginTop: 28,
                    },
                    android:{
                      marginTop: 20,
                    }
                   })
                  }}>
                  <PauseIcon width={20} height={20} />
                  <Text style={{fontSize: 15, color: '#1E1F4B'}}>Pause</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal
          isVisible={isModalVisible}
          style={{flex: 1, backgroundColor: '#0000'}}
          onBackdropPress={() => setModalVisible(!isModalVisible)}>
          <View
            style={{
              justifyContent: 'center',
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 20,
              alignItems: 'center',
            }}>
            <Image
              source={require('../assests/images/CarLocaton.png')}
              resizeMethod={'resize'}
              resizeMode={'center'}
              style={{
                width: wp('60%'),
                justifyContent: 'center',
                alignItems: 'center',
                height: hp('25%'),
              }}
            />
            <Text
              style={{
                color: '#3972FE',
                fontSize: 22,
                fontWeight: '700',
                textAlign: 'center',
              }}>
              GPS{' '}
              <Text
                style={{
                  color: '#1E1F4B',
                  fontSize: 22,
                  fontWeight: '700',
                }}>
                Tracker
              </Text>
            </Text>
            <Text style={{textAlign: 'center'}}>
              Lorem Ipsum is simply dummy text of {'\n'}the printing and
              typesetting
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 15,
                marginTop: 15,

                alignSelf: 'center',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: paused ? '#F24C5C' : '#F9F9F9',
                  width: wp('30%'),
                  height: hp('4%'),
                  borderRadius: 10,
                }}
                onPress={togglePaused}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: paused ? '#fff' : '#000',
                    alignItems: 'center',
                    ...Platform.select({
                      ios: {
                        marginTop: 10,
                      },
                      android: {
                        marginTop: 5,
                      },
                    }),
                    fontFamily: fonts.Bold,
                    fontWeight: '700',
                  }}>
                  {paused ? 'Continue' : 'Pause'}
                </Text>
              </TouchableOpacity>
            </View>
            {start ? (
              <View style={{...styles.Row, height: 45}}>
                <TouchableOpacity
                  onPress={EndTracking}
                  style={{
                    backgroundColor: '#F9F9F9',
                    width: wp('30%'),
                    height: hp('4%'),
                    borderRadius: 10,
                    marginTop: 10,
                  }}>
                  {saving_track ? (
                    <ActivityIndicator color={'green'} size={'small'} />
                  ) : (
                    <Text
                      style={{
                        color: '#1E1F4B',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...Platform.select({
                          ios: {
                            marginTop: 10,
                          },
                          android: {
                            marginTop: 5,
                          },
                        }),
                        fontFamily: fonts.SemiBold,
                        fontWeight: '700',
                      }}>
                      Stop
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                disabled={saving_track}
                onPress={() => {
                  if (!location_permission) {
                    StartTracking();
                  } else {
                    setLocationPermission(false);
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#000',
                    alignItems: 'center',
                    marginTop: 10,
                    fontFamily: fonts.Bold,
                    fontWeight: '700',
                  }}>
                  {location_permission
                    ? 'Not Avaliable Without Location '
                    : 'Start Tracking'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </View>
    </>
  );
};

export default GpsTrackerScreen;

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
    justifyContent:'center',
    alignItems:'centerx',
    marginTop: 14,
    borderRadius: 7,
    backgroundColor: '#F9F9F9',
    width: wp('95%'),
    height: hp('7.3%'),
    shadowOffset: {
      width: 0,
    },
    elevation:5,
    shadowColor: 'black',
  },
  button: {
    backgroundColor: '#F9F9F9',
    width: wp('30%'),
    height: hp('8.5%'),
    borderRadius: 8,
    marginBottom:5,
    elevation:5
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
  history:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:9,
    marginTop:8,
  },
  maplayer:{
      justifyContent:'center',
      alignItems:'center',
      marginLeft:2,
      marginTop:1
  },
  FullScreen:{
    justifyContent:'center',
      alignItems:'center',
    marginLeft:2,
    marginTop:1
  }
});
