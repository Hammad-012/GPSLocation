import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, View ,StyleSheet} from 'react-native';
import NativeAdView, {
  AdBadge,
  AdvertiserView,
  CallToActionView,
  HeadlineView,
  IconView,
  StarRatingView,
  StoreView,
  TaglineView,
} from 'react-native-admob-native-ads';
import {adUnitIDs} from '../NativeAds/adUtils/utlis';
import { MediaView } from './MediaView/MediaView';
import { useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP } from 'react-native-responsive-screen';

export const NativeBanner = React.memo(({ media, type, loadOnMount = true }) => {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef();
  const isFocused = useIsFocused();

  const onAdFailedToLoad = (event) => {
    setError(true);
    setLoading(false);
   console.log('AD', 'FAILED', event);
  };

  const onAdLoaded = () => {
    console.log('AD', 'LOADED', 'Ad has loaded successfully');
  };

  const onAdClicked = () => {
    console.log('AD', 'CLICK', 'User has clicked the Ad');
  };

  const onAdImpression = () => {
    console.log('AD', 'IMPRESSION', 'Ad impression recorded');
  };

  const onNativeAdLoaded = (event) => {
    console.log('AD', 'RECIEVED', 'Unified ad  Recieved', event);
    setLoading(false);
    setLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
  };

  const onAdLeftApplication = () => {
    console.log('AD', 'LEFT', 'Ad left application');
  };

  useEffect(() => {
    if (loadOnMount && !loaded && isFocused) {
      nativeAdRef.current?.loadAd();
    }
  }, [loadOnMount, loaded, isFocused]);

  return (
    <NativeAdView
      ref={nativeAdRef}
      onAdLoaded={onAdLoaded}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdLeftApplication={onAdLeftApplication}
      onAdClicked={onAdClicked}
      onAdImpression={onAdImpression}
      onNativeAdLoaded={onNativeAdLoaded}
      refreshInterval={60000 * 2}
      style={{
        width: '100%',
        alignSelf: 'center',
        display: isFocused ? 'flex' : 'none', 
      }}
      videoOptions={{
        customControlsRequested: true,
      }}
      mediationOptions={{
        nativeBanner: true,
      }}
      adUnitID={type === "image" ? adUnitIDs.image :adUnitIDs.video}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor:'#fff'
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: !loading && !error && loaded ? 0 : 1,
            zIndex: !loading && !error && loaded ? 0 : 10,
          }}
        >
          {!loading && <ActivityIndicator size={28} color="#a9a9a9" />}
          {error && <Text style={{ color: '#a9a9a9' }}>:-(</Text>}
        </View>

        <View
          style={{
            height: 60,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            opacity: loading || error || !loaded ? 0 : 1,
            maxWidth: '100%',
          }}
        >
          <AdBadge  style={styles.adbadge} textStyle={styles.adbadgeText} />
          <IconView
            style={{
              width: 30,
              height: 30,
              marginBottom:-6
            }}
          />
          <View
            style={{
              paddingHorizontal: 6,
              flexShrink: 1,
            }}
          >
            <HeadlineView
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: 'black',
              }}
            />
            <TaglineView
              numberOfLines={2}
              style={{
                fontSize: 11,
                color: 'black',
              }}
            />
            <AdvertiserView
              style={{
                fontSize: 10,
                color: 'gray',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
            </View>
          </View>
     
        </View>
        {media ? <MediaView aspectRatio={aspectRatio} /> : null}
      </View>
      <CallToActionView
            style={[
              {
                minHeight: 40,
                paddingHorizontal: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:4,
                elevation: 10,
                
                width: widthPercentageToDP(90),
              },
              Platform.OS === 'ios'
                ? {
                    backgroundColor: '#223FD3',
                    borderRadius: 10,
                  }
                : {},
            ]}
            buttonAndroidStyle={{
              backgroundColor: '#223FD3',
              borderRadius: 10,
            }}
            allCaps
            textStyle={{
              fontSize: 13,
              flexWrap: 'wrap',
              textAlign: 'center',
              color: 'white',
            }}
          />
    </NativeAdView>
  );
});
const styles = StyleSheet.create({
  adbadge:{
    backgroundColor:'red',
   margin:2
  },
  adbadgeText:{
    color:'#fff',
    textAlign:'center'
  }
})