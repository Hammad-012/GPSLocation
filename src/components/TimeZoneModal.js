import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BigList from "react-native-big-list";
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import fonts from '../constants/font';
import time_zones from '../data/time_zone';
import addTimes from '../logic/addTimes';
import { addTimeZoneCountry } from '../store/actions/userAction';
let timeout = null;
const TimeZoneModal = ({visible, selected_countries, setVisible}) => {
  const pressable = useRef(true);
  const dispatch = useDispatch();
  const [timezone_data, setTimeZoneData] = useState( time_zones);
  const [search_text, setSearchText] = useState('');
  const onScrollStart = () => {
    if (pressable.current) {
      pressable.current = false;
    }
  };

  useEffect(() => {
    return () => timeout !== null && clearTimeout(timeout);
  }, []);

  const _renderHeader = () => {
    return (
      <View style={styles.headermainView}>
        <View style={styles.headerInputBg}>
          <TouchableOpacity
            onPress={() => searchcountry(search_text)}
            style={styles.headericonBg}>
            <FontAwesome
              name="search"
              size={20}
              color= '#1E1F4B'
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Select country by name"
            value={search_text}
            placeholderTextColor={'#1E1F4B'}
            style={styles.headerTextInput}
            onChangeText={text => searchcountry(text)}
          />
        </View>
      </View>
    );
  };

  const _renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.notFoundText}>No Result Found</Text>
      </View>
    );
  };
  const onPressCountrySelected = newItem => {
    setVisible(false);
  
    const isItemExists = selected_countries.some(
      item =>
        item.countryCode === newItem.countryCode &&
        item.zoneName === newItem.zoneName,
    );
    if (!isItemExists) {
      //s_countries.push(newItem);
      dispatch(addTimeZoneCountry(newItem));
    }
  };

  const _renderItem = ({item,index}) => {
    console.log('item',item);
    const country = item
    const time = addTimes([
      moment.utc(country.gmtOffset * 1000).format('HH:mm:ss'),
      moment().utc().format('HH:mm:ss'),
    ]);

    return (
      <TouchableOpacity
        onPress={() => onPressCountrySelected(country)}
        activeOpacity={0.95}
        style={styles.renderItemMainView}>
        <View style={styles.FlagNameView}>
          <Image
            source={{
              uri: `https://zoobiapps.com/country_flags/${country?.countryCode?.toLowerCase()}.png`,
            }}
            style={styles.imgView}
          />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
            {`${country.zoneName.split('/')[1]}, ${
              country.countryName
            }`.substring(0, 24)}
          </Text>
        </View>
        <Text
          style={{
            ...styles.text,
            marginRight: wp(5),
            textAlign: 'right',
          }}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  const searchcountry = text => {
    setSearchText(text);
    const items = time_zones.filter(row => {
      const result = `${row?.zoneName}${row?.countryName.toUpperCase()}`;
      const txt = text.toUpperCase();
      return result.indexOf(txt) > -1;
    });
    setTimeZoneData([{header: 'a', items: items}]);
  };

  return (
    <Modal
      style={styles.modalStyle}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={700}
      backdropOpacity={0.3}
      animationOutTiming={700}
      backdropTransitionInTiming={700}
      backdropTransitionOutTiming={700}
      useNativeDriver={true}
      isVisible={visible}
      onBackdropPress={() => {
        setVisible(false);
      }}
      onBackButtonPress={() => {
        setVisible(false);
      }}>
      <View style={{flex: 1, padding: 10}}>
        <BigList
          showsHorizontalScrollIndicator={false}
          contentStyle={{backgroundColor: '#fff'}}
          showsVerticalScrollIndicator={false}
          heightForIndexPath={49}
          renderItem={_renderItem}
          data={timezone_data}
          bounces={false}
          ListEmptyComponent={_renderEmpty}
          ListHeaderComponent={_renderHeader}
          headerStickyEnabled={true}
          initialContentOffset={{x: 0, y: 600}}
        />
      </View>
    </Modal>
  );
};
export default TimeZoneModal;

const styles = StyleSheet.create({
  modalStyle: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: 60,
    justifyContent: 'center',
  },
  headermainView: {
    height: 50,
    backgroundColor: '#fff',
  },
  headerTextBg: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    textAlign: 'center',
    fontFamily: fonts.Bold,
    fontSize: 16,
    color: '#1E1F4B',
    textAlignVertical: 'center',
  },
  headerInputBg: {
    height: 40,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
  },
  headericonBg: {
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  headerTextInput: {
    backgroundColor: '#f5f5f5',
    height: 30,
    flex: 1,
    paddingTop: 0,
    includeFontPadding: false,
    fontFamily: fonts.Medium,
    color: '#1E1F4B',
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  notFoundText: {
    fontFamily: fonts.Medium,
    textAlign: 'center',
    fontSize: 14,
    textAlignVertical: 'center',
    color: '#1E1F4B',
  },
  renderItemMainView: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignSelf: 'center',
    height: 43,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(100) - 30,
  },
  emptyContainer: {
    height: 50,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  FlagNameView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 12,
    alignItems: 'center',
  },
  imgView: {
    height: 30,
    width: 30,
    resizeMode: 'center',
    marginRight: 10,
    borderRadius: 30,
  },
  text: {
    fontSize: 13,
    color: '#1E1F4B',
    marginLeft: 1,
    fontFamily: fonts.Medium,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#1E1F4B',
    marginRight: 10,
    borderColor: '#1E1F4B',
  },
});
