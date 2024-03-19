import React, {useCallback, useEffect, useRef, useState} from 'react';
import { AppState, StyleSheet, View } from 'react-native';
  import NativeAdView, {
    AdBadge,
    CallToActionView,
    HeadlineView,
    IconView,
    StarRatingView,
    StoreView,
    TaglineView,
    ImageView
  } from 'react-native-admob-native-ads'
  import fonts from '../constants/font';
  import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
 
  const SCREEN_WIDTH = wp(100) - 30;
  const NativeAdLanguageAd = () => {
    const NativeRef = useRef(null);
    const [isloading,setIsLoading] = useState(false);
   const [error,setError] = useState()
    const appstate = useRef(AppState.currentState);
   
    useEffect(()=>{
      const subscription = AppState.addEventListener('change', newappState => {
        if(appstate.current.match(/inactive|background/) && newappState === 'active'){
          NativeRef.current?.loadAd()
        }
      });
      return () =>{
        subscription.remove()
      }
    },[appstate])

    useEffect(()=>{
      NativeRef.current.loadAd();
    },[])

    return(
      <NativeAdView
      ref={NativeRef}
      refreshInterval={2000}
      onNativeAdLoaded={data => {
        setIsLoading(false)
      }}
      onAdFailedToLoad={(error) => {
        setError(true);
      setIsLoading(false);
      }}
      adUnitID="ca-app-pub-3940256099942544/2247696110"
>
      <View style={{
        opacity:isloading ? 0 : 1,
        backgroundColor:'#0000'
      }}>
        <View style={styles.rowView}>
          <View style={styles.left}>
            <View  style={{flexDirection: 'row'}}>
              <IconView style={styles.iconView} />
              <View style={{
                marginLeft:5
              }}>
                <HeadlineView numberOfLines={2} style={styles.headingTitle} />
                <TaglineView numberOfLines={2} style={styles.taglineText}/>
              </View>
            </View>
          </View>
          <View style={styles.right}>
              <AdBadge style={styles.AdBadge} textStyle={styles.AdBadgeText} />
          </View>
        </View>
        <ImageView style={styles.imageView} />
        <CallToActionView
          style={styles.CallToActionView}
          textStyle={styles.CallToActionViewText}
        />
      </View>
      </NativeAdView>
    )
  }
  const styles = StyleSheet.create({
    rowView:{
      width:SCREEN_WIDTH,
      flexDirection:'row',
      marginTop:10,
      justifyContent:'space-between',
      height:30
    },
    left:{
      width:SCREEN_WIDTH  * 0.8,
      height:30,
      backgroundColor:'#fff'
    },
    iconView:{
      marginLeft: 20,
      width: 50,
      height:30,
    },
    headingTitle:{
      color: '#060606',
    fontFamily: fonts.SemiBold,
    flexDirection:'column',
    width: SCREEN_WIDTH * 0.42,
    flexWrap: 'wrap',
    fontSize: 10,
    },
    taglineText:{
      fontFamily: fonts.Medium,
      fontSize: 10,
      color: '#060606',
      width: SCREEN_WIDTH * 0.65,
    },
    right:{
      width: SCREEN_WIDTH * 0.17,
      marginRight: SCREEN_WIDTH * 0.015,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    AdBadge:{
      width: 18,
      height: 14,
      borderWidth: 1,
      borderColor: '#f9f9f9',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 2,
    },
    AdBadgeText: {
      fontSize: 6,
      color: '#077b8a',
      includeFontPadding: false,
    },
    imageView:{
      backgroundColor: '#0000',
    width: SCREEN_WIDTH-5,
    alignSelf:"center",
    justifyContent:'center',
    alignItems:'center',
    height: 80,
    resizeMode: 'contain',
    },
    CallToActionViewText: {
      color: 'white',
      fontSize: 14,
      justifyContent:'center',
      alignItems:'center',
      marginTop:8,
      fontFamily: fonts.Medium,
    },
    CallToActionView: {
      height: 30,
      width: SCREEN_WIDTH - 10,
      paddingHorizontal: 12,
      backgroundColor: '#077b8a',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      elevation: 10,
      marginTop: 10,
    },
  })
  export default NativeAdLanguageAd