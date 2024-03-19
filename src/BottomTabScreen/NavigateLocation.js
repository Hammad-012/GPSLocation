import { StyleSheet, Text, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import LocationPin from '../assests/svgs/Locationpin.svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
const NavigateLocation = ({route}) => {
    const { latitude, longitude } = route.params;
    const [mapRegion, setMapRegion] = useState({
        latitude:latitude,
        longitude: longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
      const [currentLocation,setCurrentLocation] = useState({
        latitude: 37.78825,
          longitude: -122.4324,
      })
      useEffect(()=>{
        const getLocation = () => {
           Geolocation.getCurrentPosition(
             position => {
               setCurrentLocation({
                 latitude:position.coords.latitude,
                 longitude:position.coords.longitude
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
       const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        const { latitude, longitude } = coordinate;
        setCurrentLocation({ latitude, longitude });
      };
  return (
    <View style={styles.container}>
        <MapView
            provider={MapView.PROVIDER_GOOGLE}
            style={styles.map}
            zoomEnabled={true}
            onPress={handleMapPress}
            region={mapRegion}
            onRegionChangeComplete={region => setMapRegion(region)}
          >
            <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}>
              <LocationPin width={40} height={40}  />
            </Marker>
          </MapView>
        </View>
  )
}

export default NavigateLocation

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
})