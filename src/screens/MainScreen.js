import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  AppState,
} from 'react-native';
import {CurvedBottomBarExpo} from 'react-native-curved-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CircleIcon from '../assests/svgs/MainScreenIcon.svg';
import HomeIcon from '../assests/svgs/Home.svg';
import SpeedoMeterIcon from '../assests/svgs/SpeedoMeter.svg';
import SearchIcon from '../assests/svgs/SearchIcon.svg';
import GpstoolIcon from '../assests/svgs/Gpstool.svg';
import HomeScreen from '../BottomTabScreen/HomeScreen';
import SpeedoMeterScreen from '../BottomTabScreen/SpeedoMeterScreen';
import SearchNumber from '../BottomTabScreen/SearchNumber';
import GpsTool from '../BottomTabScreen/GpsTool';
import SelectedHomeIcon from '../assests/svgs/selectedHome.svg';
import SelectedSpeedoMeterIcon from '../assests/svgs/selectedSpeedoMeter.svg';
import SelectedSearchIcon from '../assests/svgs/selectedSearch.svg';
import SelectedGPStoolIcon from '../assests/svgs/selectedGPS.svg';
import fonts from '../constants/font';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AuthRoutes} from '../constants/routes';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import {
  onMoveToBackground,
  onMoveToForeground,
} from '@quan2nd/react-native-activity-state';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppOpenAd, AdEventType} from 'react-native-google-mobile-ads';
export default function MainScreen() {
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    const OpenadUnitId = __DEV__ ? TestIds.APP_OPEN : ''
    const appOpenAd = AppOpenAd.createForAdRequest(OpenadUnitId, {
      keywords: ['fashion', 'clothing'],
    });
    const { isLoaded, isClosed, load, show,isOpened,isShowing,error } = useInterstitialAd(TestIds.INTERSTITIAL);
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
  const navigation = useNavigation();
  const handleIconClick = () => {
    navigation.navigate(AuthRoutes.addnewlocation);
  };
  const onAdFailedtoLoad = error => {
    console.log('BANNER AD LOAD TO FAILED', error);
  };
  const onAdLoadToOpen = () => {
    console.log('BANNER AD OPEN');
  };

  const _renderIcon = (routeName, selectedTab) => {
    let icon = null;
    let text = '';

    switch (routeName) {
      case 'Home':
        icon =
          routeName === selectedTab ? (
            <SelectedHomeIcon width={25} height={25} />
          ) : (
            <HomeIcon width={25} height={25} />
          );
        text = 'Home';
        break;
      case 'speedo-meter':
        icon =
          routeName === selectedTab ? (
            <SelectedSpeedoMeterIcon width={25} height={25} />
          ) : (
            <SpeedoMeterIcon width={25} height={25} />
          );
        text = 'Speedo';
        break;
      case 'Search Number':
        icon =
          routeName === selectedTab ? (
            <SelectedSearchIcon width={25} height={25} />
          ) : (
            <SearchIcon width={25} height={25} />
          );
        text = 'Search';
        break;
      case 'Gps Tool':
        icon =
          routeName === selectedTab ? (
            <SelectedGPStoolIcon width={25} height={25} />
          ) : (
            <GpstoolIcon width={25} height={25} />
          );
        text = 'GPS Tool';
        break;
    }

    return (
      <View style={styles.tabItemContainer}>
        {icon}
        <Text
          style={{
            ...styles.tabItemText,
            color: routeName === selectedTab ? 'blue' : 'gray',
          }}>
          {text}
        </Text>
      </View>
    );
  };
  const renderTabBar = ({routeName, selectedTab, navigate}) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };
  const renderCircle = ({selectedTab, navigate}) => (
    <Animated.View style={styles.btnCircleUp}>
      <TouchableOpacity style={styles.button} onPress={handleIconClick}>
        <CircleIcon height={60} width={60} />
      </TouchableOpacity>
    </Animated.View>
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shawdow}
        height={55}
        circleWidth={50}
        screenOptions={{
          headerShown: false,
        }}
        bgColor="white"
        renderCircle={renderCircle}
        tabBar={renderTabBar}>
        <CurvedBottomBarExpo.Screen
          name="Home"
          position="LEFT"
          component={HomeScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="speedo-meter"
          position="LEFT"
          component={SpeedoMeterScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="Search Number"
          component={SearchNumber}
          position="RIGHT"
        />
        <CurvedBottomBarExpo.Screen
          name="Gps Tool"
          component={GpsTool}
          position="RIGHT"
        />
      </CurvedBottomBarExpo.Navigator>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={onAdFailedtoLoad}
        onAdLoaded={onAdLoadToOpen}
        onAdClosed={error => {
          console.log('BANNER AD CLOSED TO FAILED');
        }}
        onAdOpened={error => {
          console.log('BANNER AD OPEN');
        }}
      />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor:'#fff'
  },

  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {
    backgroundColor: '#fff',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    bottom: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // elevation: 1,
  },

  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemContainer: {
    alignItems: 'center',
  },
  tabItemText: {
    fontSize: 10,
    color: '#3F3F55',
  },
});
