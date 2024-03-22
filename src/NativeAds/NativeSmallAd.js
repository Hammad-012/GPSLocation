import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet, AppState, View} from 'react-native';
import NativeAdView, {
  AdBadge,
  AdvertiserView,
  CallToActionView,
  HeadlineView,
  IconView,
  ImageView,
  StarRatingView,
  StoreView,
  TaglineView,
  TestIds,
} from 'react-native-admob-native-ads';
import fonts from '../constants/font';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const SCREEN_WIDTH = wp(100) - 30;
const NativeSmallAd = ({}) => {
  const nativeAdViewRef = useRef();
  const [error,setError] = useState()
  const [isloading, setIsLoading] = useState(true);
  useEffect(() => {
    nativeAdViewRef.current?.loadAd();
  }, []);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        nativeAdViewRef.current?.loadAd();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [appState]);
  return (
    <NativeAdView
      ref={nativeAdViewRef}
      refreshInterval={2000}
      onAdFailedToLoad={err => {
        console.log(err, 'ERROR IN SMALL ERROR');
      }}
      onNativeAdLoaded={data => {
        setIsLoading(false);
      }}
      adUnitID="ca-app-pub-3940256099942544">
       <View style={{width:wp(100),marginBottom:20,backgroundColor:'#fff'}}> 
       <View
          style={{opacity: isloading ? 0 : 1, backgroundColor: '#fff',height:heightPercentageToDP(13)}}>
          <View style={styles.rowView}>
            <View style={styles.Left}>
              <IconView style={styles.IconView}/>
              <AdBadge style={styles.AdBadge} textStyle={styles.AdBadgeText} />
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    marginLeft: 5,
                    justifyContent: 'center',
                  }}>
                  <HeadlineView numberOfLines={2} style={styles.HeadlineView} />
                  <TaglineView numberOfLines={3} style={styles.tabLineText} />
                  <StarRatingView
                    size={12}
                    style={{marginTop: 0}}
                    emptyIcon={'star-outline'}
                    emptyIconColor={'#0007'}
                  />
                </View>
               
              </View>
              <View style={styles.Right}>
              <CallToActionView
                style={styles.CallToActionView}
                textStyle={styles.CallToActionViewText}
              />
            </View>
            </View>
          </View>
        </View>
        
       </View>
    </NativeAdView>
  );
};

export default memo(NativeSmallAd);

const styles = StyleSheet.create({
  rowView: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
  },
  AdBadge: {
    width: 18,
    height: 20,
    borderWidth: 1,
    color: '#1E1F4B',
    backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 1,
    left: 2,
    borderRadius: 0,
  },
  AdBadgeText: {
    fontSize: 9,
    color: '#fff',
    includeFontPadding: false,
  },
  Left: {
    width: SCREEN_WIDTH * 0.5,
    height: 100,
    backgroundColor: '#ffffff',
    flexWrap: 'wrap',
    flex: 1,
  },
  
  IconView: {
    marginLeft: 1,
    marginTop: 20,
    width: 50,
    height: 50,
  },

  tabLineText: {
    fontFamily: fonts.Medium,
    width: SCREEN_WIDTH * 0.6,
    fontSize: 9,
    color: '#1E1F4B',
    flexWrap: 'wrap',
    flexShrink: 1,
    textAlign:'center',
  },
  HeadlineView: {
    color: '#1E1F4B',
    fontFamily: fonts.SemiBold,
    flexDirection: 'column',
    width: SCREEN_WIDTH * 0.6,
    fontSize: 10,
  },
  CallToActionView: {
    height: 30,
    width: SCREEN_WIDTH * 0.69,
    borderRadius: 5,
    backgroundColor: 'green',
    
  },
  CallToActionViewText: {
    width:SCREEN_WIDTH,
    fontSize: 14,
    fontFamily:fonts.SemiBold,
    includeFontPadding: false,
    color:'#fff',
    textAlign: 'center',
  },
  Right:{
    width:SCREEN_WIDTH,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:-30
  }
});