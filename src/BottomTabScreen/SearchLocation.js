import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import fonts from '../constants/font';
import ImageIcon from '../assests/svgs/image-plus.svg';
import LocationPin from '../assests/svgs/Locationpin.svg';
import SearchIcon from '../assests/svgs/searchIcon2.svg';
import RightArrow from '../assests/svgs/rightArrow.svg';
import {AuthRoutes} from '../constants/routes';
import {useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import Geolocation from '@react-native-community/geolocation';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SearchLocation = () => {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [contactNumber, setContactNumber] = useState('');
  const [Note, setNote] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [title, setTitle] = useState('Islamabad');
  const [imageUrl, setImageUrl] = useState(null);
  const [cameraImgUrl, setCameraImgUrl] = useState();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const dispatch = useDispatch();
  const refRBSheet = useRef();
  useEffect(() => {
    dispatch(setinittialRoute('searchlocation'));
  }, []);
  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    const {latitude, longitude} = coordinate;
    setCurrentLocation({latitude, longitude});
    const address = currentLocation;
    setTitle(address);
    storeLocationData(address, latitude, longitude);
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
  //  const handleTextInput = async (text) => {
  //   setSearchInput(text);

  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
  //     );

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();

  //     setSuggestions(data);
  //   } catch (error) {
  //     console.error('Error fetching and parsing data', error);
  //   }
  // };

  // const handleSuggestionPress = (selectedLocation) => {
  //   setSearchInput(selectedLocation.display_name);
  // setSuggestions([]);
  // };
  const handleSearchIconPress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
    //  console.log('Search API Response:', data); 
      if (data.length > 0) {
        const selectedLocation = data[0];
        const latitude = parseFloat(selectedLocation.lat);
        const longitude = parseFloat(selectedLocation.lon);
       // console.log('Selected Location:', { latitude, longitude }); 
       _animateMapToRegion({
        latitude: latitude,
        longitude: longitude,
      })
      setCurrentLocation({
        latitude,
        longitude,
      });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        getAddress({ lat: latitude, lng: longitude });
      }

    } catch (error) {
      console.error('Error fetching and parsing data', error);
    }
  };


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
        console.log(result.display_name);
        setTitle(result.display_name);
      })
      .catch(error => console.error(error));
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      path: 'images/jpeg',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
    await launchImageLibrary(options, response => {
      if (!response.didCancel) {
        console.log(response);
        const imageuri = response.assets[0].uri;
        setImageUrl(imageuri);
        setModalVisible(false);
      } else {
        console.log('Image picker cancelled');
      }
    });
  };
  ////luanch camera
  const handleCamera = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      cameraType: 'back',
      saveToPhotos: true,
    };

    try {
      const cameraPermission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });

      const faceIdPermission = PERMISSIONS.IOS.FACE_ID;
      const permissions = [cameraPermission, faceIdPermission];
      const permissionStatuses = await requestMultiple(permissions);

      if (
        permissionStatuses[cameraPermission] === 'granted' &&
        permissionStatuses[faceIdPermission] === 'granted'
      ) {
        launchCamera(options, response => {
          if (response.didCancel) {
            console.log('Camera picker canceled');
          } else {
            const cameraUrl = response.assets[0].uri;
            setCameraImgUrl(cameraUrl);
            setModalVisible(false);
          }
        });
      } else {
        console.log('Permissions not granted for camera or FaceID');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };
  ////remove photo
  const removePhoto = () => {
    setImageUrl(null);
    setModalVisible(false);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const storeLocationData = async (
    address,
    latitude,
    longitude,
    contactNumber,
    title,
    Note,
  ) => {
    try {
      let locationDataArray = [];
      const existingLocationData = await AsyncStorage.getItem('locationData');
      if (existingLocationData) {
        locationDataArray = JSON.parse(existingLocationData);
      }
      if (!Array.isArray(locationDataArray)) {
        locationDataArray = [];
      }
      locationDataArray.push({
        address,
        latitude,
        longitude,
        contactNumber,
        title,
        Note,
      });
      await AsyncStorage.setItem(
        'locationData',
        JSON.stringify(locationDataArray),
      );

      console.log(locationDataArray);
    } catch (error) {
      console.error('Error storing location data:', error);
    }
  };
  useEffect(() => {
    fetchStoredLocation();
  }, []);
  const handleSaveLocation = () => {
    const {latitude, longitude} = mapRegion;
    storeLocationData(
      locationName,
      latitude,
      longitude,
      contactNumber,
      title,
      Note,
    );
    setTitle('');
    setContactNumber('');
    setLocationName('');
    refRBSheet.current.close();
    navigation.navigate(AuthRoutes.savedlocation);
  };

  const fetchStoredLocation = async () => {
    try {
      const locationData = await AsyncStorage.getItem('locationData');
      if (locationData !== null) {
        const {address} = JSON.parse(locationData);
        setSearchInput(address);
        setSearchInput('');
      }
    } catch (error) {
      console.error('Error fetching stored location:', error);
    }
  };
  const mapref = useRef(null);
  const _animateMapToRegion = (location) => {
    const { latitude, longitude } = location;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    mapref.current.animateToRegion(newRegion, 1000);
  };
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <MapView
            ref={mapref}
            provider={'google'}
            style={styles.map}
            zoomEnabled={true}
            onPress={handleMapPress}
            initialRegion={mapRegion}
            //onRegionChange={setMapRegion}
            >
            <Marker coordinate={{latitude: currentLocation.latitude, longitude: currentLocation.longitude}}>
              <LocationPin width={40} height={40} />
            </Marker>
          </MapView>
        </View>
        <View style={styles.layercontainer}>
          <TextInput
            placeholder="Search Location"
            value={searchInput}
            onChangeText={text => setSearchInput(text)}
            style={styles.input}
            onSubmitEditing={handleSearchIconPress}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearchIconPress}>
            <SearchIcon style={styles.SearchIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <FlatList
             data={suggestions}
             renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSuggestionPress(item)}
              style={styles.suggestionItem}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.place_id}
        /> */}
      <View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              height: '60%',
            },
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#f9f9f9',
                width: 100,
                height: 100,
                borderRadius: 10,
                margin: 10,
              }}
              onPress={toggleModal}>
              {imageUrl ? (
                <Image
                  source={{uri: imageUrl}}
                  style={{width: 100, height: 100}}
                />
              ) : (
                <ImageIcon width={80} height={80} />
              )}
            </TouchableOpacity>
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={() => setModalVisible(!isModalVisible)}
              style={{flex: 1, backgroundColor: '#0000'}}>
              <View
                style={{
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                }}>
                <View style={{margin: 10, marginBottom: 10}}>
                  <TouchableOpacity onPress={handleCamera}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        color: '#1E1F4B',
                      }}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleImagePicker}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        color: '#1E1F4B',
                      }}>
                      Choose Photo from gallery
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={removePhoto}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        color: '#1E1F4B',
                      }}>
                      Remove Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TextInput
              placeholder="Enter Location Name"
              value={locationName}
              onChangeText={text => setLocationName(text)}
              style={{
                marginTop: 25,
                paddingLeft: 10,
                backgroundColor: '#f9f9f9',
                width: '65%',
                height: 45,
                borderRadius: 10,
              }}
            />
          </View>

          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                margin: 10,
                marginTop: 20,
                columnGap: 6,
                bottom: 25,
              }}>
              <View
                style={{
                  backgroundColor: '#f9f9f9',
                  width: '50%',
                  height: 50,
                  borderRadius: 12,
                }}>
                <Text style={{textAlign: 'center', marginTop: 15}}>
                  {mapRegion.latitude.toFixed(5)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#f9f9f9',
                  width: '50%',
                  height: 50,
                  borderRadius: 12,
                }}>
                <Text style={{textAlign: 'center', marginTop: 15}}>
                  {mapRegion.longitude.toFixed(5)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#f9f9f9',
                width: '95%',
                height: 60,
                borderRadius: 12,
                margin: 5,
                bottom: 33,
              }}>
              <Text
                style={{textAlign: 'center', marginTop: 10, margin: 10}}
                ellipsizeMode={'tail'}
                numberOfLines={2}>
                {' '}
                {title}
              </Text>
            </View>
          </View>
          <View>
            <TextInput
              placeholder="Contact Number"
              style={styles.contactInput}
              value={contactNumber}
              keyboardType="phone-pad"
              dataDetectorTypes={'phoneNumber'}
              onChangeText={text => setContactNumber(text)}
            />
          </View>
          <View>
            <TextInput
              placeholder="Note"
              style={styles.NoteInput}
              value={Note}
              onChangeText={text => setNote(text)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              bottom: 70,
              margin: 20,
            }}>
            <TouchableOpacity
              onPress={handleSaveLocation}
              style={{
                backgroundColor: '#3972FE',
                width: '50%',
                height: 50,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                  marginTop: 15,
                }}>
                Save Location
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#3972FE',
                width: '50%',
                height: 50,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontFamily: fonts.Bold,
                  fontWeight: '700',
                  marginTop: 15,
                }}>
                Share Location
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <View
          style={{
            backgroundColor: '#f9f9f9',
            width: wp('95%'),
            height: 60,
            margin: 10,
            borderRadius: 10,
            position: 'absolute',
            bottom: hp(77),
          }}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: 10,
              marginTop: 20,
              margin: 15,
            }}>
            <Text ellipsizeMode={'tail'}>
              latitude{currentLocation.latitude.toFixed(5)}
            </Text>
            <Text ellipsizeMode={'tail'}>
              longitude{currentLocation.longitude.toFixed(5)}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              bottom: 30,
              marginRight: 15,
            }}>
            <TouchableOpacity onPress={() => refRBSheet.current.open()}>
              <RightArrow width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default SearchLocation;

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
  // HistoryContainer: {
  //   backgroundColor: '#F9F9F9',
  //   width: wp('100%'),
  //   height: hp('15%'),
  //   borderRadius: 10,
  //   margin: 20,
  // },

  input: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 50,
      },
      android: {
        top: 20,
      },
    }),
    paddingLeft: 10,
    backgroundColor: '#f9f9f9',
    width: '95%',
    height: 60,
    margin: 10,
    borderRadius: 10,
  },
  contactInput: {
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
    width: '95%',
    height: 50,
    margin: 10,
    borderRadius: 10,
    bottom: 40,
  },
  NoteInput: {
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
    width: '95%',
    height: 50,
    margin: 10,
    borderRadius: 10,
    bottom: 50,
  },
 

  SearchIcon: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 80,
      },
      android: {
        top: 50,
      },
    }),
    right: 30,
    alignSelf: 'flex-end',
  },
});
