import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import fonts from '../constants/font';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CountrySelectionModal from './CountrySelectionModal';
const NumberSearchInput = ({
  mobile_number,
  country,
  setCountry,
  setMobileNumber,
  validate_mobile_number,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.countrySelectiondropDown}>
        <View style={styles.flag_text_view}>
          <Image
            source={{
              uri: `https://zoobiapps.com/country_flags/${country?.code.toLowerCase()}.png`,
            }}
            style={{width: 20, height: 12}}
          />
          <Text allowFontScaling={false} style={styles.text}>
            +{country?.callingCode}
          </Text>
        </View>
        <AntDesign
          name="downcircle"
          size={14}
          color={"#fff"}
        />
      </TouchableOpacity>
      <TextInput
        placeholder="Search Number"
        value={mobile_number}
        keyboardType={'phone-pad'}
        onChangeText={text => setMobileNumber(text)}
        style={styles.textinput}
      />
      <TouchableOpacity onPress={() => validate_mobile_number()}>
        <AntDesign
          name="search1"
          size={20}
          style={{paddingRight: 10}}
          color={"#1E1F4B"}
        />
      </TouchableOpacity>
      <CountrySelectionModal
        visible={visible}
        setDefaultCountry={setCountry}
        setVisible={setVisible}
      />
    </View>
  );
};

export default NumberSearchInput;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: wp(100) - 30,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    padding: 3,
  },
  countrySelectiondropDown: {
    width: 90,
    height: 34,
    borderRadius: 34,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
  },
  flag_text_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textinput: {
    width: wp(50),
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: fonts.Medium,
    color:"#1E1F4B",
    backgroundColor: '#00000005',
  },
  text: {
    
    fontFamily: fonts.Medium,
    fontSize: 12,
    marginLeft: 5,
    textAlign: 'center',
    color: '#fff',
  },
});
