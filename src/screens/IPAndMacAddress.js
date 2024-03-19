import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
import React, { useState , useEffect} from 'react';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {useNavigation} from '@react-navigation/native';
import fonts from '../constants/font';
import ShareIcon from '../assests/svgs/share.svg';
import CopyIcon from '../assests/svgs/Copy.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import CountryPicker from 'react-native-country-picker-modal';
import * as RNLocalize from 'react-native-localize';
import NetInfo from '@react-native-community/netinfo';
import Clipboard from '@react-native-clipboard/clipboard';
import { AuthRoutes } from '../constants/routes';
const IPAndMacAddress = () => {
  const navigation = useNavigation();
  const [ipAdrress, setIPAddress] = useState(null);
  const [macAddress, setMACAddress] = useState(null);
  const [deviceInfo,setDeviceInfo] = useState(null);
  const [IPv4Address,setIPV4Address]  = useState(null);
  const [countryName,setCountryName] = useState(null);
  const [IPv6Address,setIPV6Address] = useState(null);
  const [externalIp, setExternalIp] = useState(null);
  const [wifiStatus, setWifiStatus] = useState('unknown');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setinittialRoute('ipmacaddress'));
  }, []);

  DeviceInfo.getIpAddress().then((IPaddress) => {
    console.log('IPAddress',IPaddress)
      setIPAddress(IPaddress)
  })

  DeviceInfo.getMacAddress().then((macadd)=>{
    console.log('mac address',macadd);
    setMACAddress(macadd);
  })

  DeviceInfo.getDeviceName().then((deviceName) => {
    console.log('device name',deviceName);
    setDeviceInfo(deviceName);

  });
  
  NetworkInfo.getIPV4Address().then(ipv4Address => {
    console.log('ipv4',ipv4Address);
    setIPV4Address(ipv4Address)
  });
  
  useEffect(() => {
    const deviceCountry = RNLocalize.getCountry();
    setCountryName(deviceCountry);
  }, []);

  // useEffect(()=>{
  //   const unsubscribe = NetInfo.addEventListener((state)=>{
  //     if(state.details && state.details.ipAddress){
  //       const ipv6 = state.details.ipAddress.filter((ip) => ip.includes(':'));
  //       console.log('ipv6',ipv6);
  //       setIPV6Address(ipv6.length > 0 ? ipv6[0] : null);
  //     }
  //   })
  //   return () => {
  //     unsubscribe();
  //   };
  // },[])
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setWifiStatus(state.isConnected && state.type === 'wifi' ? 'connected' : 'disconnected');
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    const fetchExternalIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setExternalIp(data.ip);
      } catch (error) {
        console.error('Error fetching external IP:', error);
      }
    };

    fetchExternalIp();
  }, []);


  const copyIPV4Addresss = () => {
   const ipv4Address = IPv4Address
    console.log('ipv4 in copy clipboard',ipv4Address);
    Clipboard.setString(ipv4Address);
  }


  ///copy external IPV4 address

  const externalIPV4Address = () => {
    const externalIPV = externalIp;
    console.log('external ipv4 address',externalIPV);
    Clipboard.setString(externalIPV)
  }

  /// copy mac address 

  const copymacAddress = () => {
    const copymac = macAddress;
    console.log('copy mac',copymac);
    Clipboard.setString(copymac);
  }
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row', gap: 10, margin: 20}}>
        <TouchableOpacity onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrow width={20} height={20} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          My IP & Mac{' '}
          <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
            Address
          </Text>
        </Text>
      </View>
      {/* container */}
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            Country
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
           {countryName ? countryName: 'loading'}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            Internal IPv4 :
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
             ...Platform.select({
              ios:{
                marginTop: 5,
              },
              android:{
                marginTop: 0,
              }
             }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
            {ipAdrress}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            Internal IPv4 :
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
            {IPv4Address}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'flex-end',
              bottom: 25,
            }}>
            <TouchableOpacity onPress={copyIPV4Addresss}>
           <CopyIcon />
           </TouchableOpacity>
            <ShareIcon />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            IPv6 Address:
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
           AA00::e0e0:a7bb:ia98:2804
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'flex-end',
              bottom: 25,
            }}>
           <TouchableOpacity>
           <CopyIcon />
           </TouchableOpacity>
            <ShareIcon />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            External IPv4:
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
           {externalIp ? externalIp : 'Loading...'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'flex-end',
              bottom: 25,
            }}>
            <TouchableOpacity onPress={externalIPV4Address}>
            <CopyIcon />
            </TouchableOpacity>
            <ShareIcon />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            MAC Address:
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
            {macAddress ? macAddress : 'loading'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'flex-end',
              bottom: 25,
            }}>
          <TouchableOpacity onPress={copymacAddress}>
          <CopyIcon />
          </TouchableOpacity>
            <ShareIcon />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            Connectivity
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
            WIFI: {wifiStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{...Platform.select({ios:{margin: 10,},android:{margin: 5,}}), marginLeft: 25}}>
          <Text
            style={{color: '#1E1F4B', fontFamily: fonts.Regular, fontSize: 10}}>
            Device Info:
          </Text>
          <Text
            style={{
              color: '#1E1F4B',
              ...Platform.select({
                ios:{
                  marginTop: 5,
                },
                android:{
                  marginTop: 0,
                }
               }),
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
           {deviceInfo}{' '}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IPAndMacAddress;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: wp('95%'),
    height: hp('6%'),
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
});
