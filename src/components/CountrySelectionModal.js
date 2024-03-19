import React, { memo, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import BigList from 'react-native-big-list';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import countries from '../data/countries.json';
import fonts from '../constants/font';

const CountrySelectionModal = ({ visible, setDefaultCountry, setVisible }) => {
  const [countryData, setCountryData] = useState(countries);
  const [searchText, setSearchText] = useState('');

  const searchCountry = text => {
    setSearchText(text);
    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(text.toLowerCase()) ||
      country.code.toLowerCase().includes(text.toLowerCase())
    );
    setCountryData(filteredCountries);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          setDefaultCountry(item);
          setSearchText('');
          setVisible(false);
        }}
        style={styles.renderItemMainView}>
        <View style={styles.FlagNameView}>
          <FastImage
            source={{
              uri: `https://zoobiapps.com/country_flags/${item.code.toLowerCase()}.png`,
            }}
            style={styles.imgView}
          />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
            {item.name}
          </Text>
        </View>
        <Text style={{ ...styles.text, marginRight: wp(5), textAlign: 'right' }}>
          (+{item.callingCode})
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    searchCountry(searchText);
  }, [searchText]);

  return (
    <Modal
      style={styles.modalStyle}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      backdropOpacity={0.3}
      animationOutTiming={700}
      hideModalContentWhileAnimating={true}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={700}
      useNativeDriver={true}
      isVisible={visible}
      onBackdropPress={() => {
        setVisible(false);
      }}>
      <View style={styles.headermainView}>
        <View style={styles.headerTextBg}>
          <Text style={styles.headerTitle}>Select your country</Text>
        </View>
        <View style={styles.headerInputBg}>
          <FontAwesome name="search" size={20} color="#1E1F4B" />
          <TextInput
            placeholder="Select country by name"
            value={searchText}
            style={styles.headerTextInput}
            onChangeText={text => setSearchText(text)}
          />
        </View>
      </View>
      <BigList
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, paddingHorizontal: 10 }}
        contentStyle={{ backgroundColor: '#fff' }}
        showsVerticalScrollIndicator={false}
        itemHeight={49}
        renderItem={renderItem}
        data={countryData}
        bounces={false}
      />
    </Modal>
  );
};

export default CountrySelectionModal;

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: 100,
    justifyContent: 'center',
  },
  headermainView: {
    height: 105,
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
    margin:5,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
  },
  headerTextInput: {
    margin:10,
    backgroundColor: '#F5F5F5',
    height: 30,
    flex: 1,
    paddingTop: 0,
    includeFontPadding: false,
    fontFamily: fonts.Medium,
    color: '#1E1F4B',
    paddingBottom: 0,
    paddingHorizontal: 10,
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
  FlagNameView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 12,
    alignItems: 'center',
  },
  imgView: {
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius: 30,
  },
  text: {
    fontSize: 13,
    color: '#1E1F4B',
    marginLeft: 1,
    fontFamily: fonts.Medium,
  },
});
