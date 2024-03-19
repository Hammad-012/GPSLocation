import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from 'react-native';
import React,{useState,useEffect,useRef} from 'react';
import LeftArrowIcon from '../assests/svgs/leftarrowIcon.svg';
import MapIcon from '../assests/svgs/Map.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import LocationPinIcon from '../assests/svgs/Locationpin.svg';
import PlusIcon from '../assests/svgs/PlusIcon.svg';
import MinusIcon from '../assests/svgs/MinusIcon.svg';
import MapLayer from '../assests/svgs/MapLayer.svg';
import LocationPin from '../assests/svgs/Locationpin.svg';
import MyLocation from '../assests/svgs/my-location.svg';
import fonts from '../constants/font';
import { useDispatch } from 'react-redux';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { AuthRoutes } from '../constants/routes';
import { useSelector } from 'react-redux';
const AlltitudeMeterScreen = () => {
  const MapRef = useRef(null)
  const {location} = useSelector(state => state.userReducer);
  const navigation = useNavigation();
  const dispatch = useDispatch('');
  useEffect(() => {
    dispatch(setinittialRoute('alltitudemeter'));
  }, []);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [selectedLayer,setSelectedLayer] = useState('standard');
  const [title,setTitle] = useState('Rawalpindi');
  const [alltitude,setAlltitude] =  useState();
 const [markerLocation, setMarketLocation] = useState({
    latitude: location.coords.latitude ? location.coords.latitude : 0,
    longitude: location.coords.longitude ? location.coords.longitude : 0,
  });
  const [loadingAltitiude, setLoadingAltitude] = useState(false);
  const [altitude, setAltitude] = useState(
    parseFloat(location.coords.altitude).toFixed(2),
  );
  useEffect(() => {
    // animateMapToRegion();

    setMarketLocation({
      latitude: location.coords.latitude
        ? parseFloat(location.coords.latitude)
        : 0,
      longitude: location.coords.longitude
        ? parseFloat(location.coords.longitude)
        : 0,
    });
  }, [location]);

  // var _map = MapView;
  // const animateMapToRegion = () => {
  //   _map.animateToRegion(
  //     {
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //       latitudeDelta: 0.2 ,
  //       longitudeDelta: 0.05 ,
  //     },
  //     3500,
  //   );
  // };

  const getAltitudefromCoords = ({latitude, longitude}) => {
    setLoadingAltitude(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`,

      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setLoadingAltitude(false);
        setAltitude(parseFloat(result.results[0].elevation).toFixed(2));
      })
      .catch(error => {
     
        //Alert.alert('SOME ERROR', 'PLEASE TRY AGAIN LATER');
        setLoadingAltitude(false);
      });
  };

  console.log(title);
  const handleLayer = () => {
    if(selectedLayer === 'satellite'){
      setSelectedLayer('standard')
    }
    else {
      setSelectedLayer('satellite')
    }
  }

  console.log('altitude meter ',alltitude);
  useEffect(()=>{
   const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('postion in alltitude meter',position);
          setCurrentLocation({
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
          });
          _animateMapToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setAlltitude(position.coords.altitude);
          getAddress({
          lat:position.coords.latitude,
          lng:position.coords.longitude,
         })
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      )
   }
   getLocation();
  },[])

  const getAddress = ({lat,lng}) => {
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
  }
  const onZoomInPress = () => {
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: Math.max(0.001, currentLocation.latitudeDelta / 2),
        longitudeDelta: Math.max(0.001, currentLocation.longitudeDelta / 2),
      }, 300);
    }
  };
  
  const onZoomoutPress = () => {
    const currentMap = MapRef.current;
    if (currentMap) {
      currentMap.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: Math.min(160, currentLocation.latitudeDelta * 2),
        longitudeDelta: Math.min(160, currentLocation.longitudeDelta * 2),
      }, 300);
    }
  };
  // const handleMapPress = event => {
  //   const {latitude, longitude} = event.nativeEvent.coordinate;
  //   setMarkerCoordinate({latitude, longitude});
  //   getAddress({lat:latitude,lng:longitude})
  // };
  const _animateMapToRegion = (Location) => {
    const { latitude, longitude } = Location;
    const newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    if (MapRef.current) {
      MapRef.current.animateToRegion(newRegion, 1000); 
    }
  };

  return (
    <>
      <View style={{backgroundColor: '#fff',flex:1}}>
      <View style={styles.container}>
      <MapView
      
          style={styles.map}
          mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
          onPress={event => {
            {
              setMarketLocation({
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
              });

              getAltitudefromCoords({
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
              })
                getAddress({lat:event.nativeEvent.coordinate.latitude,lng:event.nativeEvent.coordinate.longitude})
            }
          }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.2 ,
            longitudeDelta: 0.05 ,
          }}
          zoomEnabled={true}
          minZoomLevel={1}
          ref={ref => (_map = ref)}
          provider={'google'}
          
          >
          <Marker coordinate={markerLocation}>
            <LocationPin
              width={30}
              height={30}
            />
          </Marker>
        </MapView>
        </View>
      </View>
      <View style={styles.AbsoluteContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrowIcon width={70} height={70} style={styles.LeftArrowIcon} />
        </TouchableOpacity>
        <View style={{flexDirection:'row',marginLeft:70,marginTop:22}}>
          <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
            Measure{' '}
            <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
              Altitude
            </Text>
          </Text>
        </View>
        <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-end',
          top: hp(30),
          right: 30,
        }}>
      
      
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
         
      </View>
        <View style={styles.containers}> 
          <View style={styles.subcontainer}>
           <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',margin:10}}>
           <LocationPin  width={25} height={25}/>
           <Text style={{color:'#1E1F4B',marginRight:30,paddingTop:5,textAlign:'center',paddingLeft:10}}>  {title.length > 30 ? title.substring(0,30) + '':title}</Text>
          <TouchableOpacity nPress={()=>{
            MapRef.current.animateToRegion({
              latitude:currentLocation.latitude,
              longitude:currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            })
          }} >
          <MyLocation width={25} height={25} style={styles.MyLocation} />
          </TouchableOpacity>
           </View>
           {loadingAltitiude ? (
              <ActivityIndicator color={'green'} size={'small'} />
            ) : (
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: fonts.Medium,
                  color: '#3972FE',
                  fontWeight:'700',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Altitude = {altitude} m
              </Text>
            )}
          </View>
       </View> 
      </View>
      
    </>

  );
};

export default AlltitudeMeterScreen;

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
  AbsoluteContainer:{
    position:'absolute',
    ...Platform.select({
      ios:{
        marginTop:50
      }
    })
  },
  LeftArrowIcon: {
    position: 'absolute',
  },
  PlusIcon:{
    marginLeft:10
  },
  MinusIcon:{
    marginLeft:11
  },
  layerIcon:{
    marginLeft:6,
  },
  containers:{
    top:hp(75),
    backgroundColor:'#fff',
    width:wp('100%'),
    height:hp(20),
    borderRadius:10
  },
  subcontainer:{
    backgroundColor:'#F9F9F9',
    width:wp('90%'),
    height:hp(10),
    margin:20,
    borderRadius:10,
  },
  IconsContainer:{
    position:'relative',
    top:hp('40%'),
    ...Platform.select({
      ios:{
        left:330,
        rowGap:15,
      },
      android:{
        left:330,
        rowGap:15,
      }
    })
  },
  MyLocation:{
      right:20
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
