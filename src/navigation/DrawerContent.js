import React from 'react';
import {
  View,
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import 'react-native-gesture-handler';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

  import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
import fonts from '../constants/font';
import route_data from './drawer_data';
const DrawerContent = ({navigation}) => {
    const dispatch = useDispatch();
    const rateUs = async () => {
      Linking.openURL(
        'https://apps.apple.com/us/app/gps-tracker-phone-location/id1672969168',
      );
    };
  
    const privacyPolicy = async () => {
      Linking.openURL(
        'https://sites.google.com/metasoltechnologies.com/metasol-technologies-privacy/home',
      ).catch(err => {
        
      });
    };
  
    const EULA = async () => {
      Linking.openURL(
        'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
      ).catch(err => {
        
      });
    };
  
    const shareApp = async () => {
      try {
        const result = await Share.share({
          message: `GPS Tracker: Install GPS Tracker and Track all your jounrey. https://apps.apple.com/us/app/gps-tracker-phone-location/id1672969168`,
        });
      } catch (error) {}
    };
  
    return (
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.imgBg}>
        <Image
          source={require('../assests/images/splashIcon2.png')}
          style={{
            resizeMode: 'cover',
            width: 150,
            borderRadius: 100,
            height: 150,
          }}
        />
      </View>
        {route_data.map((item, index) => (
          <TouchableOpacity
            key={`${index}`}
            style={styles.btnView}
            onPress={() => {
              if (item.type == 'route') {
                navigation.navigate('MainScreen');
              } else {
                // dispatch(setCanShowAppOpenAds(false));
                if (item.route == 'rateUs') {
                  rateUs();
                } else if (item.route == 'PrivacyPolicyScreen') {
                  privacyPolicy();
                } else if (item.route == 'shareApp') {
                  shareApp();
                } else {
                  EULA();
                }
              }
            }}>
            {item.icon}
            <Text style={styles.textStyle}>{item.label}</Text>
            <Entypo
              size={wp(6)}
              style={{position: 'absolute', right: wp(3)}}
              name={'chevron-small-right'}
              color={'#1E1F4B'}
            />
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    );
  };
  export default DrawerContent;
  
  const styles = StyleSheet.create({
    SafeAreaView: {
      backgroundColor: '#fff',
      flex: 1,
      // width:wp(100)
    },
   
    btnView: {
      paddingLeft: wp(5),
      height: hp(7),
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#0001',
      width: '100%',
      alignItems: 'center',
    },
    imgBg: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: '#0001',
      marginBottom: 20,
      height: 250,
    },
    textStyle: {
      marginLeft: wp(4),
      fontFamily: fonts.Medium,
      color: '#000000D0',
      width: wp(40),
      fontSize: 14,
      includeFontPadding: false,
    },
  });