import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import countries from '../data/countries.json';
import { useDispatch, useSelector } from 'react-redux';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import { setCountry } from '../store/actions/CountryAction';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import fonts from '../constants/font';
import { useNavigation } from '@react-navigation/native';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
import { AuthRoutes } from '../constants/routes';

const AreaCode = () => {
  const navigation = useNavigation();
  const { country } = useSelector(state => state.countryReducer);
  const [selectedCountry, setSelectedCountry] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries); // Initialize with all countries
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setinittialRoute('areacode'));
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCountryPress = (item) => {
    setSelectedCountry(item);
    toggleModal();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(text.toLowerCase()) ||
      country.code.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filteredCountries);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', gap: 10, margin: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrow width={20} height={20} />
        </TouchableOpacity>
        <Text style={{ color: '#3972FE', fontSize: 18, fontWeight: '700' }}>
          Area{' '}
          <Text style={{ color: '#1E1F4B', fontSize: 18, fontWeight: '700' }}>
            Code
          </Text>
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search Country"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <View>
        <FlatList
          data={filteredCountries} // Use filteredCountries instead of countries
          showsVerticalScrollIndicator={true}
          bounces={false}
          style={styles.flatListContainer}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Result Found</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                dispatch(setCountry(item));
                handleCountryPress(item);
              }}
              style={{ ...styles.cardView, flexDirection: 'row' }}>
              <Image
                style={{ height: 20, width: 30, marginRight: 20 }}
                source={{
                  uri: `https://zoobiapps.com/country_flags/${item.code.toLowerCase()}.png`,
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{item.name}</Text>
                <Text>+{item.callingCode}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Image
            style={{ height: 50, width: 80, marginBottom: 10 }}
            source={{
              uri: `https://zoobiapps.com/country_flags/${selectedCountry?.code.toLowerCase()}.png`,
            }}
          />
          <Text style={{ color: '#1E1F4B' }}>Country Name <Text style={{ fontFamily: fonts.Bold, fontSize: 18, fontWeight: '700' }}>:{selectedCountry?.name}</Text></Text>
          <Text style={{ color: '#1E1F4B' }}>Country Code  <Text style={{ fontFamily: fonts.Bold, fontSize: 18, fontWeight: '700' }}>:{selectedCountry?.code}</Text></Text>
          <Text style={{ color: '#1E1F4B' }}>Calling Code <Text style={{ fontFamily: fonts.Bold, fontSize: 18, fontWeight: '700' }}>:{selectedCountry?.callingCode}</Text></Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AreaCode;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'black',
  },
  cardView: {
    margin: 10,
    paddingVertical: 15,
    padding: 10,
    backgroundColor: '#F5F5F5',
    width: wp('95%'),
    height: 50,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    marginBottom: 4
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
