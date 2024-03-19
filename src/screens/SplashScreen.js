import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useRef} from 'react';
import fonts from '../constants/font';
import LottieView from 'lottie-react-native';
import {AuthRoutes} from '../constants/routes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
const SplashScreen = () => {
  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL);
  const navigation = useNavigation();
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(200);
    load();
    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
   
  }, [navigation,load]);
  useEffect(() => {
    if (isClosed) {
       navigation.navigate(AuthRoutes.Language);
    }
  }, [isClosed, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const delayNavigation = async () => {
        if (isLoaded) {
          console.log('ISLOADED',isLoaded);
          show();
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          // navigation.navigate(AuthRoutes.Language);
        }
      };
      delayNavigation(); 
    }, [navigation,isLoaded])
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Image
          source={require('../assests/images/splash.png')}
          style={{width: wp('55%'), height: hp('20%'), marginTop: 50}}
        />
        <Text style={styles.GPStext}>
          GPS <Text style={styles.trackerText}>Tracker</Text>
        </Text>
        <LottieView
          ref={animationRef}
          style={styles.lottie}
          source={require('../assests/animation/gps_splash_loading.json')}
        />
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  GPStext: {
    color: '#3972FE',
    fontSize: 38,
    fontWeight: '700',
    fontFamily: fonts.Bold,
    lineHeight: 40,
  },
  trackerText: {
    color: '#1E1F4B',
    fontSize: 38,
    fontWeight: '700',
    fontFamily: fonts.Bold,
    lineHeight: 40,
  },
  lottie: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 100,
    width: 100,
    marginTop: 10,
  },
});
