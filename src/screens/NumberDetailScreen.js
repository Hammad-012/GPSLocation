import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Image,
} from 'react-native';

import React, {useState, useRef, useEffect} from 'react';
import Contacts from 'react-native-contacts';
import MapView, {Marker} from 'react-native-maps';
import Toast from 'react-native-toast-message';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {useNavigation} from '@react-navigation/native';
import MapPicture from '../assests/images/Map.png';
import LocationPin from '../assests/svgs/Locationpin.svg';
import DailIcon from '../assests/svgs/dialIcon.svg';
import MessageIcon from '../assests/svgs/messageIcon.svg';
import CreateIcon from '../assests/svgs/createIcon.svg';
import WhatsAppIcon from '../assests/svgs/whatsapp1.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from '../constants/font';
import {useDispatch, useSelector} from 'react-redux';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import {setAddressLocation} from '../store/actions/userAction';
import {
  SearchNumberValidationIOS,
  search_mobileNumber,
} from '../Validation/SearchNumberValidation';

const NumberDetailScreen = ({navigation, route}) => {
  const items = route.params?.item;
  const countrycode = route?.params?.selectedCountry;
  console.log('countrycode',countrycode);
  const number = route?.params?.mobile_number
  console.log('number',number); 
  console.log('result of api',items);
  console.log();
  // const {country} = useSelector(state => state.countryReducer);
  // console.log('DATA in detaail screen',country);
  const [dataresult, setDataResult] = useState(route.params.item);

  const mapViewRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      animatedMaptoRegion({
        latitude: dataresult.capital_latitude,
        longitude: dataresult.capital_longitude,
        latitudeDelta: 7.5,
        longitudeDelta: 7.5,
      });
    }, 2000);
  });
  const animatedMaptoRegion = newLocation => {
    mapViewRef?.current?.animateToRegion(newLocation, 4500);
  };

  const takeAction = text => {
    if (text == 'Call') {
      Linking.openURL(`tel:+${countrycode.callingcode}${number}`);
    } else if (text == 'Message') {
      Linking.openURL(`sms:+${countrycode.callingcode}${number}`);
    } else if (text == 'WhatsApp') {
      Linking.openURL(`whatsapp://send?text="Hello"&phone=+${countrycode.callingcode}${number}`);
    } else {
      var newPerson = {
        phoneNumbers: [
          {
            label: 'mobile',
            number: `+${countrycode.callingcode}${number}`,
          },
        ],

        familyName: name,
        givenName: name,
      };

      Contacts.openContactForm(newPerson);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row', gap: 10, margin: 10}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrow width={20} height={20} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          Number{' '}
          <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
            Details
          </Text>
        </Text>
      </View>
      <View style={{margin: 20}}>
        <MapView
          style={{...StyleSheet.absoluteFillObject,}}
          ref={mapViewRef}
          provider={'google'}
          initialRegion={{
            latitude: parseFloat(dataresult?.capital_latitude),
            longitude: parseFloat(dataresult?.capital_longitude),
            latitudeDelta: 0.2,
            longitudeDelta: 0.05,
          }}
          zoomEnabled={true}
          minZoomLevel={0}
          maxZoomLevel={100}>
          <Marker
            coordinate={{
              latitude: parseFloat(dataresult?.capital_latitude),
              longitude: parseFloat(dataresult?.capital_longitude),
            }}
          />
        </MapView>
        <View style={{margin: 20,top:200,}}>
          <Text
            style={{
              color: '#1E1F4B',
              fontFamily: fonts.Bold,
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 8,
            }}>
            {dataresult.number}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Location:
            </Text>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {dataresult?.country}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Network:
            </Text>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {dataresult.network ? dataresult?.network : 'Unknown'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Type:
            </Text>
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {dataresult.type ? dataresult.type : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 25,
          alignItems: 'center',
          top:200
        }}>
        <TouchableOpacity onPress={() => takeAction('Call')}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <DailIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              Call
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takeAction('Message')}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MessageIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              Message
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CreateIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              Create
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takeAction('WhatsApp')}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <WhatsAppIcon />
            <Text
              style={{
                color: '#1E1F4B',
                fontFamily: fonts.Bold,
                fontSize: 12,
                fontWeight: '500',
                marginTop: 5,
              }}>
              WhatsApp
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NumberDetailScreen;

const styles = StyleSheet.create({
  
});
