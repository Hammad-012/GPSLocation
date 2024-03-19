import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import React, { useEffect, useState, } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import fonts from '../constants/font';
import { AuthRoutes } from '../constants/routes';
import privacy_data from '../data/privacy_policy';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
const PrivacyPolicyScreen = () => {
  const {selectedLanguage} = useSelector(state =>  state.languageReducer)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setinittialRoute('privacypolicy'));
  }, []);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <SafeAreaView style={{flex: 1,}}>
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        
        {privacy_data.map((item, index) => (
          <View key={`${index}`} style={styles.carditem}>
            <Text style={styles.title}>{item.h}</Text>
            <Text style={styles.paragraph}>{item.p}</Text>
          </View>
        ))}
        
      </ScrollView>
        </View>
        <View style={styles.policyContainer}>
        <View style={{flexDirection: 'row', gap: 10, margin: 15}}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            boxType={'square'}
            style={{...Platform.select({
              ios:{
                width: 20, height: 20
              },
              android:{
                width: 30, height: 30
              }
            })}}
            onValueChange={newValue => setToggleCheckBox(newValue)}
          />
          <Text style={{...Platform.select({
            ios:{
              marginTop:2
            },
            android:{
              marginTop:5
            }
          })}}>{selectedLanguage.privacy_policy}</Text>
       </View>
        {
          toggleCheckBox === true ? (
            <TouchableOpacity
            onPress={()=>navigation.navigate(AuthRoutes.onboarding)}
              style={{
                backgroundColor: '#3972FE',
                width: '80%',
                height: 40,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 18,fontWeight:'700'}}>{selectedLanguage.Next}</Text>
            </TouchableOpacity>
          ):(
            <TouchableOpacity
            disabled={true}
            onPress={()=>navigation.navigate(AuthRoutes.onboarding)}
              style={{
                backgroundColor: 'grey',
                width: '80%',
                height: 40,
                
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 14,fontWeight:'400'}}>{selectedLanguage.Next}</Text>
            </TouchableOpacity>
          )
        }

        </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  PrivacyPolicyText: {
    color: '#3972FE',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  textStyle: {
    color: '#555454',
    textAlign: 'justify',
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  contentContainerStyle: {
    alignItems: 'center',
    backgroundColor: '#fff',

  },
  carditem: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    padding: 20,
    flexDirection: 'column',
    
  },
  title: {
    color: '#555454',
    fontFamily: fonts.Bold,
    fontSize: 16,
  },
  paragraph: {
    color: '#555454',
    lineHeight: 12 * 1.4,
    // backgroundColor: '#fff',
    fontFamily: fonts.Medium,
    fontSize: 12,
    textAlign: 'justify',
    
  },
  policyContainer:{
   
    backgroundColor:'#fff',
    height:'15%',
    shadowColor:'black',
    elevation:15
  }
});
