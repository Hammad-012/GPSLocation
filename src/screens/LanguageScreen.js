import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import English from '../assests/images/usa.png';
import FranciasCountry from '../assests/images/france.png';
import SothKorea from '../assests/images/south_korea.png';
import India from '../assests/images/india.png';
import Portuguese from '../assests/images/pourtgal.png';
import Espanol from '../assests/images/spain.png';
import PakistanIcon from '../assests/images/pakistan.png';
import JapanIcon from '../assests/images/japan.png';
import {AuthRoutes} from '../constants/routes';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import {setSelectLanguage} from '../store/actions/languageAction';
import translationalLanguage from '../store/index';
import fonts from '../constants/font';
import NativeAdLanguageAd from '../NativeAds/NativeLanguageAds';
const LanguageScreen = ({}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [coverIndex, setCoverIndex] = useState(null);
  useEffect(() => {
    dispatch(setinittialRoute('Language'));
  }, []);
  console.log(translationalLanguage, 'DSDSD');
 

  const handlecoverIndex = index => {
    setCoverIndex(index === coverIndex ? null : index);
  };
  const handleNaviagtion = () =>{
    if (coverIndex == null) {
      Alert.alert('EROOR!', 'SELECT LANGUAGE');
    } else {
      dispatch(
        setSelectLanguage({
          selectedLanguageName: Languages[coverIndex].id,
          selectedLanguage:
            translationalLanguage[Languages[coverIndex].id],
        }),
      ).then(() => {
        navigation.navigate(AuthRoutes.PrivacyPolicyScreen);
      });
    }
  }
  const Languages = [
    {
      icon: English,
      title: 'English',
      id: 'English',
    },
    {
      icon: Espanol,
      title: 'Espanol',
      id: 'Spanish',
    },
    {
      icon: Portuguese,
      title: 'Portuguese',
      id: 'Portuguese',
    },
    {
      icon: India,
      title: 'भारत',
      id: 'Hindi',
    },
    {
      icon: SothKorea,
      title: '대한민국',
      id: 'Korean',
    },
    {
      icon: FranciasCountry,
      title: 'French',
      id: 'French',
    },
    {
      icon: PakistanIcon,
      title: 'اردو',
      id: 'Urdu',
    },
    {
      icon: JapanIcon,
      title: '漢字',
      id: 'Japanese',
    },
    // {
    //     icon:SouthAfricaIcon,
    //     title:'Afrikaans'
    // },
    // {
    //     icon:IndonessiaIcon,
    //     title:'Indonesia'
    // }
  ];
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.rowContainer}>
        {Languages.map((item, index) => (
          <TouchableOpacity
            onPress={() => handlecoverIndex(index)}
            style={styles.container}
            key={index}>
            <Image source={item.icon} style={styles.ImageStyle} />
            <Text style={styles.textStyle}>{item.title}</Text>
            <View style={styles.coverIcon}>
              {coverIndex === index && (
                <Icon name="check-circle" size={25} color="#3972FE" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
      onPress={handleNaviagtion}
        style={{
          backgroundColor: '#3972FE',
          height: hp(7),
          borderRadius: 10,
          margin: 10,
          alignItems: 'center',
          justifyContent:'center'
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: fonts.Bold,
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          Let's Go
        </Text>
      </TouchableOpacity>
        <NativeAdLanguageAd />
    </View>
  );
};
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    width: wp('100%'),
    columnGap:8,
    margin: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
   
  },
  container: {
    width: wp(46),
    height: hp(13),
    marginTop: 5,
    backgroundColor: '#F9F9F9',
    padding: 5,
    borderRadius: 10,
  },
  ImageStyle: {
    width: 50,
    height: 40,
    marginTop: 16,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textStyle: {
    textAlign: 'center',
    color: '#060606',
    fontWeight: 'bold',
  },
  coverIcon: {
    position: 'absolute',
    right: 10,
    marginTop: 10,
  },
});

export default LanguageScreen;
