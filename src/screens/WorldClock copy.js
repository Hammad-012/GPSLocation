import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DeviceCountry, {TYPE_TELEPHONY} from 'react-native-device-country';
import BigList from 'react-native-big-list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import countries from '../data/countries.json';
import TimeZoneModal from '../components/TimeZoneModal';
import fonts from '../constants/font';
import addTimes from '../logic/addTimes';
import {deleteTimeZoneCountry} from '../store/actions/userAction';
import AnalogClock from 'react-native-clock-analog';
import WorldClock from '../assests/svgs/ClockCircle.svg';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {AuthRoutes} from '../constants/routes';
import {useNavigation} from '@react-navigation/native';
import {Swipeable} from 'react-native-gesture-handler';
let timeout = null;
const WorldClockScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(moment().format('hh:mm A'));
  const {selected_countries} = useSelector(state => state.userReducer);

  const [country, setCountry] = useState('');

  useEffect(() => {
    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
      .then(result => {
        setCountry(
          countries[0].items.find(
            item => item.code == result.code.toUpperCase(),
          ).name,
        );
      })
      .catch(e => {});
    let interval = setInterval(() => {
      setTime(moment().format('hh:mm A'));
    }, 1000);
    return () => {
      clearInterval(interval);
      timeout !== null && clearTimeout(timeout);
    };
  }, []);

  const _renderSelectedItem = ({item, index}) => {
    let country = item;
    const is_behind = country.gmtOffset > 0 ? 'ahead' : 'behind';
    let t_hours = Math.abs(country.gmtOffset / 3600);
    const time = addTimes([
      moment.utc(country.gmtOffset * 1000).format('HH:mm:ss'),
      moment().utc().format('HH:mm:ss'),
    ]);

    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            onPress={() => dispatch(deleteTimeZoneCountry(country))}
            style={{
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 20,
              width: '20%',
            }}>
            <Text style={{color: 'white'}}>Delete</Text>
          </TouchableOpacity>
        )}>
        <TouchableOpacity
          onPress={() => dispatch(deleteTimeZoneCountry(country))}
          activeOpacity={0.95}
          style={styles.renderItemMainView}>
          <View style={styles.FlagNameView}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
              {`${country?.countryName}`.substring(0, 24)}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{...styles.text, fontSize: 10}}>
              {`${t_hours} hours ${is_behind}`} then GMT
            </Text>
          </View>
          <Text
            style={{
              ...styles.text,
              fontFamily: fonts.Medium,
              fontSize: 16,
              marginRight: 15,
              textAlign: 'right',
            }}>
            {time.slice(0, -2)}
            <Text
              style={{
                ...styles.text,
                fontFamily: fonts.Regular,
                fontSize: 12,
                marginRight: 15,
                textAlign: 'right',
              }}>
              {time.slice(-2)}
            </Text>
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          margin: 10,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrow width={20} height={20} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          World{' '}
          <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
            Clock
          </Text>
        </Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', }}>
          <Text style={{fontFamily: fonts.Medium, color: '#000', fontSize: 40}}>
            {time.slice(0, -3)}
          </Text>
          <Text
            style={{
              fontFamily: fonts.Medium,
              color: '#3972FE',
              fontSize: 10,
              marginTop: 20,
            }}>
            {time.slice(-2)}
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Text
            style={{
              fontFamily: fonts.Medium,
              color: '#000',
              marginVertical: 10,
              fontSize: 15,
            }}>
            {moment().format('ddd')}, {moment().format('MMM-YY')}
          </Text>
          <Text
            style={{
              fontFamily: fonts.Medium,
              color: '#1E1F4B',
              fontSize: 15,
            }}>
            {country}
          </Text>
          </View>
         
       

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <AnalogClock
            size={250}
            colorNumber="#fff"
            colorCenter="#3972FE"
            colorHour="#3972FE"
            colorMinutes="#1E1F4B"
            autostart={true}
            showSeconds
          />
          <WorldClock width={250} height={250} style={styles.WorldClock} />
        </View>
        <BigList
          showsHorizontalScrollIndicator={false}
          style={{flex: 1}}
          contentStyle={{backgroundColor: 'red'}}
          showsVerticalScrollIndicator={false}
          heightForIndexPath={49}
          renderItem={_renderSelectedItem}
          data={selected_countries}
          bounces={false}
          headerStickyEnabled={true}
        />
        <TimeZoneModal
          visible={visible}
          setVisible={setVisible}
          selected_countries={selected_countries}
        />

        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}>
          <AntDesign name={'pluscircle'} color="#1E1F4B" size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorldClockScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  renderItemMainView: {
    width: '90%',
    borderRadius: 10,
    margin: 20,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    height: 50,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  FlagNameView: {
    paddingLeft: 12,
    columnGap: 10,
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
    rowGap: 20,
    fontFamily: fonts.Medium,
  },
  WorldClock: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
