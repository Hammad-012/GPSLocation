import {Image, StyleSheet, Text, TouchableOpacity, View,Platform,Linking,StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import fonts from '../constants/font';
import HumbergIcon from '../assests/svgs/Humberg.svg';
import LocatonMapIcon from '../assests/svgs/LocationMap.svg';
import StationAlertIcon from '../assests/svgs/StationAlert.svg';
import BatterIcon from '../assests/svgs/batterIcon.svg';
import WhatsappIcon from '../assests/svgs/whatsapp.svg';
import FacebookIcon from '../assests/svgs/facebook.svg';
import InstagramIcon from '../assests/svgs/instagram1.svg';
import FindAddressIcon from '../assests/svgs/findaddressIcon.svg';
import GPSIcon from '../assests/svgs/gps_cordinates.svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AuthRoutes } from '../constants/routes';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import CustomHeader from '../components/CustomHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import { onMoveToBackground,onMoveToForeground } from '@quan2nd/react-native-activity-state';
import { setLocation } from '../store/actions/userAction';
const HomeScreen = () => {
  const adUnitId = __DEV__ ? TestIds.APP_OPEN : ''
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
  });
  const dispatch = useDispatch()
  const { isLoaded, isClosed, load, show,isOpened,isShowing,error } = useInterstitialAd(TestIds.INTERSTITIAL);
  const [route,setRoute] = useState(null);
  const {selectedLanguage} = useSelector(state =>  state.languageReducer)
  const navigation = useNavigation();
  const [currentAddress, setCurrentAddress] = useState('');
  useEffect(() => {
    const subscriptionFore = onMoveToForeground(async () => {
      AsyncStorage.getItem("canShowAppOpenAd").then((value) => {
        console.log("canShowAppOpenAd in AsyncStorage", value);
        if(value != null  && value != "false" && appOpenAd.loaded){
          appOpenAd.show();
        }
      })
      
    });
    const subscriptionBack = onMoveToBackground(() => {
     ! appOpenAd.loaded && appOpenAd.load();
    })
    },[]);
  useEffect(() => {
    if (error !== undefined) {
      AsyncStorage.setItem('canShowAppOpenAd', 'true');
      console.log('ERROR',error);
      navigation.navigate(route)
    }
  }, [error]);

  useEffect(() => {
    if (isLoaded) {
      show();
      console.log('ISLOADED');
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isClosed) {
      console.log('ISCLOSED',isClosed);
      AsyncStorage.setItem('canShowAppOpenAd', 'true');
     
    }
  }, [isClosed]);

  useEffect(() => {
    if (isOpened) { 
      console.log('ISOPENED',isOpened);
      AsyncStorage.setItem('canShowAppOpenAd', 'false');
      navigation.navigate(route)
    }
  }, [isOpened]);
  useEffect(() => {
    fetchCurrentAddress();
  }, []);

  const fetchCurrentAddress = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('GSGSGSG',position);
        dispatch(setLocation(position))
        const { latitude, longitude } = position.coords;
        getAddressFromCoords(latitude, longitude);
      },
      error => {
        console.error(error.message);
      
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
    );
  };
  const getAddressFromCoords = (latitude, longitude) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1&accept-language=en`
    )
      .then(response => response.json())
      .then(data => {
        setCurrentAddress(data?.display_name);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const openWhatsApp = async () => {
    const url = `whatsapp://send?text=Hello`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error('WhatsApp is not installed on this device.');
    }
  };
  
  const openFacebook = () => {
    Linking.openURL('https://www.facebook.com/');
  };
  
  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/');
  };

 const addressLines = currentAddress.split(',');
 const firstLine = addressLines.slice(0, 5).join(',');

   
    const handleGpsTracker = () =>{
      load();
      setRoute(AuthRoutes.gpstracker)
    }

    const handleStationAlert = () => {
      load();
      setRoute(AuthRoutes.stationalert)
    }

    const handlefindAddrss = () => {
      load();
      setRoute(AuthRoutes.findaddress)
    }
  
   const handlegpsCoordinateScreen = () => {
    load();
    setRoute(AuthRoutes.gpscordinatescreen)
   }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row',columnGap:10}}>
       <CustomHeader />
        <View style={{marginTop: 20}}>
          <Text style={{color: '#3972FE', fontSize: 15, fontFamily: fonts.SemiBold,fontWeight:'700'}}>
            GPS{' '}
            <Text style={{color: '#1E1F4B', fontSize: 15, fontFamily: fonts.SemiBold,fontWeight:'700'}}>
              Tracker
            </Text>
          </Text>
        </View>
      </View>
      <View>
        <Text
        ellipsizeMode={'tail'}
         numberOfLines={2}
          style={{
            color: '#1E1F4B',
            fontSize: 12,
            fontFamily: fonts.Light,
            fontWeight:'400',
            textAlign: 'center',
            margin:13
          }}>
         {firstLine}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>handleGpsTracker()}>
        <View style={styles.GPSContainer}>
          <LocatonMapIcon
            height={50}
            width={50}
            style={styles.LocatonMapIcon}
          />
          <Text
            style={{
              color: '#1E1F4B',
              fontSize: 12,
              paddingLeft: 30,
              fontFamily: fonts.Bold,
              fontWeight:'700'
            }}>
           {selectedLanguage.GPSTracker}
          </Text>
        </View>
        </TouchableOpacity>
        <View style={styles.StationAlertIcon}>
          <TouchableOpacity onPress={handleStationAlert}>
          <StationAlertIcon
            height={50}
            width={50}
            style={styles.LocatonMapIcon}
          />
          <Text
            style={{
              color: '#1E1F4B',
              fontSize: 12,
              paddingLeft: 35,
              fontFamily: fonts.Bold,
              fontWeight:'700'
            }}>
           {selectedLanguage.station_Alert}
          </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{flexDirection: 'row', gap: 10, marginLeft: 10, marginTop: 10}}>
        <Text style={{color: '#1E1F4B', fontSize: 14, fontFamily: fonts.Bold,fontWeight:'700'}}>
         {selectedLanguage.Share_Location}
        </Text>
        {/* <View style={{flexDirection: 'row', gap: 5, marginBottom: 5}}>
          <BatterIcon width={15} height={15} style={styles.batteryIcon} />
          <Text style={{fontSize: 8, marginTop: 5}}> {batteryLevel !== null ? batteryLevel.toFixed() + '%' : 'Loading...'}</Text>
        </View> */}
      </View>
      <View style={{flexDirection:'row',margin:12,gap:10,justifyContent:'center',alignItems:'center',marginLeft:8,}}>
       <TouchableOpacity onPress={openWhatsApp}>
       <View style={styles.whatsappcontainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent:'center',
              alignItems:'center',
              marginHorizontal: 15,
              marginTop: 13,
              gap: 5,
            }}>
            <WhatsappIcon width={24} height={24} />
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 12,
                fontFamily: fonts.SemiBold,
                fontWeight:'700',
                marginRight:15,
                justifyContent:'center',
                alignItems:'center'
              }}>
             {selectedLanguage.Whatsapp}
            </Text>
          </View>
        </View>
       </TouchableOpacity>
        <TouchableOpacity onPress={openFacebook}>
        <View style={styles.FacebookContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent:'center',
              alignItems:'center',
              marginHorizontal: 15,
              marginTop:13,
              gap: 5,
            }}>
            <FacebookIcon width={24} height={24} />
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 12,
                fontFamily: fonts.SemiBold,
                fontWeight:'700',
                marginRight:15,
                justifyContent:'center',
                alignItems:'center'
              }}>
              {selectedLanguage.Facebook}
            </Text>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openInstagram}>
        <View style={styles.InstagramContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent:'center',
              alignItems:'center',
              marginHorizontal: 12,
              marginTop:13,
              gap: 5,
            }}>
            <InstagramIcon width={24} height={24} />
            <Text
              style={{
                color: '#1E1F4B',
                fontSize: 12,
                fontFamily: fonts.SemiBold,
                fontWeight:'700',
                marginRight:15,
                justifyContent:'center',
                alignItems:'center'
              }}>
              {selectedLanguage.Instagram}
            </Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text style={{color:'#1E1F4B',fontSize:15,fontFamily:fonts.Bold,margin:15, fontWeight:'700',marginLeft:10}}>Other Function</Text>
      </View>
      <TouchableOpacity onPress={handlefindAddrss}>
      <View style={{flexDirection:'row',marginLeft:8,gap:10}}>
          <View style={styles.findaddressIcon}> 
              <FindAddressIcon width={40} height={40} style={styles.icon}/>
          </View>
          <Text style={{color:'#1E1F4B',fontSize: 14,fontFamily:fonts.Bold,marginTop:20,fontWeight:'700'}}>{selectedLanguage.FindAddress}</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlegpsCoordinateScreen}>
        <View style={{flexDirection:'row',marginLeft:8,gap:10}}>
          <View style={styles.gpscoordinateicon}> 
              <GPSIcon width={65} height={65} style={styles.gpscoordinateIcoon} />
          </View>
          <Text style={{color:'#1E1F4B',fontSize: 14,fontFamily:fonts.Bold,fontWeight:'700',marginTop:40}}>{selectedLanguage.GPS_Coordinate}</Text>
        </View>
        </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
 
  GPSContainer: {
    margin:8,
    alignSelf:'center',
    marginHorizontal:5,
    backgroundColor: '#F9F9F9',
    width: wp('45%'),
    height: hp('11%'),
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
    },
    borderRadius: 17,
  },
  StationAlertIcon:{
    margin:8,
    backgroundColor: '#F9F9F9',
    width: wp('45%'),
    height: hp('11%'),
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
    },
    borderRadius: 17,
  },
  LocatonMapIcon: {
    marginHorizontal: 30,
    margin: 5,
  },
  batteryIcon: {
    marginTop: 3,
  },
  whatsappcontainer: {
    width: wp('29%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      height: 1,
    },
  },
  FacebookContainer:{
    width: wp('29%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      height: 1,
    },
  },
  InstagramContainer:{
    width: wp('29%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      height: 1,
    },
  },
  findaddressIcon:{
    backgroundColor:'#F9F9F9',
    width:80,
    height:70,
    shadowOffset:{
      height:1
    },
    borderRadius:10
  },
  findaddressIcon1:{
    marginTop:20,
    backgroundColor:'#F9F9F9',
    width:80,
    height:70,
    shadowOffset:{
      height:1
    },
    borderRadius:10
  },
  icon:{
    alignItems:'center',
    marginLeft:17,
    marginTop:12
  },
  gpscoordinateicon:{
    marginTop:20,
    backgroundColor:'#F9F9F9',
    width:80,
    height:70,
    shadowOffset:{
      height:1
    },
    borderRadius:10
  },
  gpscoordinateIcoon:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:7
  }
});
