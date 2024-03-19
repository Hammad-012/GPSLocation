import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import React, {useState,useEffect} from 'react';
import HumbergIcon from '../assests/svgs/Humberg.svg';
import fonts from '../constants/font';
import Toast from 'react-native-toast-message';
import SelectedIcon from '../assests/svgs/selected.svg';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import countries from '../data/countries.json';
import {useDispatch, useSelector} from 'react-redux';
import {setCountry} from '../store/actions/CountryAction';
import CountrySelectionModal from '../components/CountrySelectionModal';
import CustomHeader from '../components/CustomHeader';
import NumberSearchInput from '../components/NumberSearchInput';
import Geolocation from '@react-native-community/geolocation';
import { SearchNumberValidationIOS,search_mobileNumber } from '../Validation/SearchNumberValidation';
const SearchNumber = ({navigation,searchCountry}) => {
  const {selectedLanguage} = useSelector(state=>state.languageReducer);
  console.log('selected',selectedLanguage);
  const dispatch = useDispatch();
  const {country} = useSelector(state => state.countryReducer);
  console.log('countries',country);
  const [selectedCountry, setSelectedCountry] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [mobile_number, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false); 
  const [dataresult, setDataResult] = useState({
    country: '',
    capital: '',
    capital_latitude: '',
    capital_longitude: '',
    network: '',
    state: '',
    city: '',
    latitude: '',
    longitude: '',
  });
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  

  useEffect(() => {
    
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            const userCountry = data.countryCode;
            console.log('country',userCountry);
          
            if (userCountry !== selectedCountry?.code) {
            
              const countryData = countries.find(country => country.code === userCountry);
              setSelectedCountry(countryData);
            }
          })
          .catch(error => console.error('Error fetching country:', error));
      },
      error => console.error('Error getting location:', error),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  }, [selectedCountry])
  
  // useEffect(() => {
  //   if (route.params.number == mobile_number) {
  //     getNamefromContactList();
  //     SearchNumberOnline(item);
  //   }
  //   return () => timeout !== null && clearTimeout(timeout);
  // }, []);



 
  const SearchNumberOnline = () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
   
    var raw = JSON.stringify({
      local_number: mobile_number,
      country_iso2: selectedCountry.code,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://appredarseo.com/gpstracker/numbergps.php', requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoading(false); 
        console.log('result',result)
       navigation.navigate(AuthRoutes.numberdetail,{item:result,selectedCountry:selectedCountry,mobile_number:mobile_number})
       
      })
      .catch(error => {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'There is some error occurred',
          text2: `We are working hard to bring things working`,
          position: 'bottom',
        });
      });
  };
const handleCountrySelection = (country) => {
  setSelectedCountry(country);
  setShowDropdown(false);
};
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row',columnGap:10}}>
      <CustomHeader />
        <View style={{marginTop: 15}}>
          <Text style={{color: '#3972FE', fontSize: 15, fontWeight: '700'}}>
            Search{' '}
            <Text style={{color: '#1E1F4B', fontSize: 15, fontWeight: '700'}}>
              Number
            </Text>
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            color: '#1E1F4B',
            fontSize: 14,
            fontWeight: '700',
            fontFamily: fonts.Bold,
            marginLeft: 27,
            marginTop:15
          }}>
          {selectedLanguage.selectcountrycode}
        </Text>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.countrycodeContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <Text>
                {selectedCountry
                  ? `${selectedCountry.name} +${selectedCountry.callingCode}`
                  : 'Select Country'}
              </Text>
              <SelectedIcon width={15} height={15} />
            </View>
          </TouchableOpacity>
          {showDropdown && (
          <CountrySelectionModal
            visible={showDropdown}
            setDefaultCountry={handleCountrySelection}
            setVisible={setShowDropdown}
            searchCountry={searchCountry}
          />
        )}
        </View>
      </View>
      <View>
        <Text
          style={{
            color: '#1E1F4B',
            fontSize: 14,
            fontWeight: '700',
            fontFamily: fonts.Bold,
            marginLeft: 27,
            marginTop: 10,
          }}>
          {selectedLanguage.enterphonenumber}
        </Text>
        <View style={{margin: 10}}>
        <TextInput 
        placeholder='Enter Number'
        style={styles.inputNumber}
        value={mobile_number}
        onChangeText={text=>setMobileNumber(text)}
        />
        </View>
      </View>
      <TouchableOpacity
        style={styles.StartButton}
        onPress={SearchNumberOnline}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontFamily: fonts.Bold,
            fontWeight: 'bold',
            color: '#fff',
          }}>
         {loading ? (
           <ActivityIndicator size="small" color="#fff"  style={{alignSelf:'center'}} />
        ) : (
          <Text style={{ textAlign: 'center',  fontSize: 20, fontFamily: fonts.Bold, fontWeight: 'bold', color: '#fff' }}>{selectedLanguage.search}</Text>
        )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchNumber;

const styles = StyleSheet.create({
  HumbergIcon: {
    margin: 15,
  },
  countrycodeContainer: {
    alignSelf: 'center',
    backgroundColor: '#3972FE1A',
    width: wp('90%'),
    height: 40,
    borderRadius: 10,
  },
  inputNumber: {
    padding: 10,
    alignSelf: 'center',
    width: wp('90%'),
    height: 40,
    backgroundColor: '#3972FE1A',
    borderRadius: 8,
  },
  StartButton: {
    margin: 15,
    marginLeft: 20,
    width: wp('90%'),
    height: 50,
    backgroundColor: '#3972FE',
    borderRadius: 10,
    justifyContent:'center',
    alignItems:'center'
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
      height: 2,
    },
    marginBottom: 4,
  },
});
