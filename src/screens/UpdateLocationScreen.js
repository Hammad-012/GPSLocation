import React, { useState,useEffect,useRef } from 'react';
import {  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Button,
  FlatList,
  Alert,} from 'react-native';
  import LeftArrowIcon from '../assests/svgs/leftarrowIcon.svg';
import fonts from '../constants/font';
import { useDispatch,useSelector } from 'react-redux';
import { updateLocationAlert } from '../store/actions/locationAlertAction';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import { useNavigation } from '@react-navigation/native';
import { AuthRoutes } from '../constants/routes';
import { useToast } from "react-native-toast-notifications";
import MapLayer from '../assests/svgs/MapLayer.svg';
import FullScreen from '../assests/svgs/fullscreen.svg';
import Slider from '@react-native-community/slider';
import Geolocation from '@react-native-community/geolocation';
import { setLocation } from '../store/actions/userAction';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, { Marker,Circle} from 'react-native-maps';
import LocationPin from '../assests/svgs/Locationpin.svg';
import PlusIcon from '../assests/svgs/PlusIcon.svg';
import MinusIcon from '../assests/svgs/MinusIcon.svg';
import CurrentLocation from '../assests/svgs/currentLocationIcon.svg';
import notifee from '@notifee/react-native';
import moment from 'moment';
const UpdateLocationScreen = ({ route }) => {
  const { item,index } = route.params;
  const toast = useToast();
  const {location} = useSelector(state => state.userReducer);
  console.log(item,'item');
  console.log(index,'index');
  const dispatch = useDispatch();
  const [isEnabledinside, setIsEnabledinside] = useState(false);
  const [isEnabledoutside, setIsEnabledoutside] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedRadius, setEditedRadius] = useState(item.radius);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editIndex, seteditIndex] = useState(null);
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
  const [markerLocation, setMarkerLocation] = useState(item.coords);
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const handleUpdate = (item,index) => {
    if (editedName.trim() !== '') {
      const updatedLocationtemp = { ...item, name: editedName, radius: editedRadius, };
      console.log(updatedLocationtemp)
      toast.show("Location Update Successfully", {
        type: "success",
        placement: "top",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
      dispatch(updateLocationAlert({index, item:updatedLocationtemp}))
      seteditIndex(index)
      setEditingLocation(null);
      setEditedName('');
      setEditedRadius('');
     
    } 
    
    else {
      alert('Please enter valid information');
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
    updateLocationAlert(prevState => ({
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

  

  const onFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const handleSliderChange = value => {
    setSliderValue(value);
    setCircleRadius(value * 10000);
  };
  const handleMapPress = e => {
    // Extract latitude and longitude from the pressed location
    const { latitude, longitude } = e.nativeEvent.coordinate;
    // Update the marker location state
    setMarkerLocation({ latitude, longitude });
  };

  const animateMapToRegion = (location) => {
    const {latitude,longitude} = location;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    }
    mapViewRef.current.animateToRegion(newRegion,1000)
}
  

  return (
  <>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
      <MapView
          ref={mapViewRef}
          style={styles.map}
          mapType={selectedLayer === 'standard' ? 'standard' : 'satellite'}
          onPress={handleMapPress} 
          initialRegion={{
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
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
        <LocationPin width={40} height={40} />
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
          onPress={() => navigation.navigate(AuthRoutes.addnewlocationscreen)}>
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
          top: hp(25),
          right: 10,
        }}>
        <TouchableOpacity onPress={onZoomInPress}>
          <View style={{marginBottom: 10}}>
            <PlusIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onZoomoutPress}>
          <View style={{marginBottom: 10}}>
            <MinusIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLayer}>
          <View style={{marginBottom: 10}}>
            <MapLayer />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
        mapViewRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }}>
          <View style={{marginBottom: 10}}>
            <CurrentLocation />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onFullScreen}>
          <View style={{marginBottom: 10}}>
            <FullScreen />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.sheetContainer}>
      <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={setEditedName}
          placeholder="Enter location name"
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
          value={editedRadius}
          onChangeText={setEditedRadius}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
          }}>
          <Text style={{color: '#3972FE', margin: 10}}>Moving outside</Text>
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
          <Text style={{color: '#3972FE', margin: 10}}>Moving inside</Text>
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
            backgroundColor: '#3972FE',
            width: '90%',
            height: 50,
            borderRadius: 10,
            alignSelf: 'center',
          }}
          onPress={()=>handleUpdate(item,index)}>
          <Text
            style={{
              color: '#fff',
              fontFamily: fonts.Bold,
              fontWeight: '500',
              textAlign: 'center',
              fontSize: 14,
              marginTop: 15,
            }}>
            Update Place
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

export default UpdateLocationScreen;

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
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
