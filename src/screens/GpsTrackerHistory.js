import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, TouchableOpacity, StyleSheet,Platform} from 'react-native';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {useSelector} from 'react-redux';
import GPSHistory from '../screens/GPSHistory';
import fonts from '../constants/font';
import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AuthRoutes } from '../constants/routes';
const TrackHistoryScreen = () => {
  const {track} = useSelector(state => state.trackReducer);
  const navigation = useNavigation();
  const renderItem = ({item, index}) => {
    // console.log('ITEM RENDER',item);
    return <GPSHistory item={item} index={index} />;
  };

  return (
    <>
    <View
        style={{
          flexDirection: 'row',
          gap: 10,
          margin: 10,
          ...Platform.select({
            ios:{
              marginTop:50
            },
            android:{
              marginTop:25
            }
          })
        }}>
        <TouchableOpacity onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrow width={20} height={20} style={styles.LeftArrowIcon} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          GPSHistory{' '}
        </Text>
      </View>
    <FlatList
        data={track}
        bounces={false}
        style={{flex: 1}}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              height: hp(80),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: fonts.Medium, color: 'black'}}>
              No Track History Found
            </Text>
          </View>
        }
        contentStyle={{backgroundColor: '#fff'}}
        showsVerticalScrollIndicator={false}
        heightForIndexPath={() => 'auto'}
        renderItem={renderItem}
      />
    </>
  );
};
const styles = StyleSheet.create({
  LeftArrowIcon: {
    ...Platform.select({
      android: {
        marginTop: 2,
      },
    }),
  },
});
export default TrackHistoryScreen;
