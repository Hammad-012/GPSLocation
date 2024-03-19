import { StyleSheet, Text, TouchableOpacity, View,Platform } from 'react-native'
import React,{useState,useEffect} from 'react';
import HumbergIcon from '../assests/svgs/Humberg.svg';
import fonts from '../constants/font';
import AreaCodeIcon from '../assests/svgs/areacode.svg'
import CompassIcon from '../assests/svgs/compass.svg';
import AlltitudeIcon from '../assests/svgs/AltitudeMeter.svg';
import WorldClockIcon from '../assests/svgs/worldclock1.svg';
import IpAddressIcon from '../assests/svgs/IpAddress.svg'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AuthRoutes } from '../constants/routes';
import CustomHeader from '../components/CustomHeader';
import { useSelector } from 'react-redux';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GpsTool = () => {
  const { isLoaded, isClosed, load, show,isOpened,isShowing,error } = useInterstitialAd(TestIds.INTERSTITIAL);
  const [route,setRoute] = useState(null);
  const {selectedLanguage} = useSelector(state=>state.languageReducer);
  console.log('selected',selectedLanguage);
  const navigation = useNavigation();
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
  const handleAreaCode = () =>{
    load();
    setRoute(AuthRoutes.areacode)
  }

  const handleCompass = () => {
    load();
    setRoute(AuthRoutes.compass)
  }

  const handleAlltitudeMeter = () => {
    load();
    setRoute(AuthRoutes.allitudemeter)
  }

 const handleWorldClock = () => {
  load();
  setRoute(AuthRoutes.worldclock)
 }

 const handleIPAddress = () => {
  load();
  setRoute(AuthRoutes.ipmacaddress)
 }

  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
       <View style={{flexDirection: 'row',columnGap:10}}>
       <CustomHeader />
        <View style={{marginTop: 15}}>
          <Text style={{color: '#3972FE', fontSize: 15, fontWeight: '700'}}>
            GPS{' '}
            <Text style={{color: '#1E1F4B', fontSize: 15, fontWeight: '700'}}>
              Tool
            </Text>
          </Text>
        </View>
      </View>
      <View style={{flexDirection:'row',flexWrap:'wrap',margin:10,columnGap:20}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleAreaCode}>
            <AreaCodeIcon width={50} height={50} style={styles.AreacodeIcon}/>
            <Text style={{color:'#1E1F4B',fontSize:13,fontFamily:fonts.Bold,fontWeight:'700',marginLeft:20,bottom:7}}>{selectedLanguage.areacode}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleCompass}>
            <CompassIcon width={50} height={50} style={styles.AreacodeIcon}/>
            <Text style={{color:'#1E1F4B',fontSize:13,fontFamily:fonts.Bold,fontWeight:'700',marginLeft:20,bottom:7}}>{selectedLanguage.compass}</Text>
            </TouchableOpacity> 
        </View>
        <View style={styles.container}>
           <TouchableOpacity onPress={handleAlltitudeMeter}>
           <AlltitudeIcon width={50} height={50} style={styles.AreacodeIcon}/>
           </TouchableOpacity>
            <Text style={{color:'#1E1F4B',fontSize:13,fontFamily:fonts.Bold,fontWeight:'700',marginLeft:20,bottom:7}}>{selectedLanguage.altitudemeter}</Text>
        </View>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleWorldClock}>
            <WorldClockIcon width={50} height={50} style={styles.AreacodeIcon}/>
            </TouchableOpacity>
            <Text style={{color:'#1E1F4B',fontSize:13,fontFamily:fonts.Bold,fontWeight:'700',marginLeft:20,bottom:7}}>{selectedLanguage.worldclock}</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleIPAddress}>
            <IpAddressIcon width={50} height={50} style={styles.AreacodeIcon}/>
            </TouchableOpacity>
            <Text style={{color:'#1E1F4B',fontSize:13,fontFamily:fonts.Bold,fontWeight:'700',marginLeft:20,bottom:7}}>{selectedLanguage.ipaddress}</Text>
        </View>
      </View>
    </View>
  )
}

export default GpsTool

const styles = StyleSheet.create({
    HumbergIcon: {
        margin: 15,
      },
      container:{
        width:wp('43%'),
        backgroundColor:'#F9F9F9',
        height:hp('13%'),
        borderRadius: 17,
        marginBottom:10
      },
      AreacodeIcon:{
        margin:15
      }
})