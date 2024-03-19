import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import HumbergIcon from '../assests/svgs/Humberg.svg';
import SpeedoMeterIcon from '../assests/svgs/speedometer2.svg';
import SpeedoMeterIconBlack from '../assests/svgs/speedometer_black.svg';
import fonts from '../constants/font';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import getDistance from '../logic/getDistance';
import CustomHeader from '../components/CustomHeader';
import Speedometer, {
  Background,
  Marks,
  Needle,
  Progress,
} from '../components/speedmeter';


const SpeedoMeterScreen = () => {
  const [speed, setSpeed] = useState('0');
  const {selectedLanguage} = useSelector(state=>state.languageReducer)
  const {location} = useSelector(state => state.userReducer);

  const [start_position, setStartPosition] = useState({
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  });
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [calculated_speed, setCalculatedSpeed] = useState(
    ['0', '0', '0'].concat(speed.toString().split('')).slice(-3),
  );
  console.log(speed);
  const [speed_info, setSpeedObj] = useState({
    avg_speed: 0,
    distance: 0,
    max_speed: 0,
    min_speed: 0,
  });

  const [is_start, setIsStart] = useState(false);

  useEffect(() => {
    return () => {
      clearWatch();
    };
  }, []);
  useEffect(() => {
    setCalculatedSpeed(
      ['0', '0', '0'].concat(parseInt(speed).toString().split('')).slice(-3),
    );
  }, [speed]);

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setStartPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSpeed(position.coords.speed * 3.60934);
        calculate_speed(position.coords.speed * 3.60934);
        calculate_distance(position.coords);
        watchPosition();
      },
      error => {
        console.log(error);
        getOneTimeLocation();
      },
      {enableHighAccuracy: false, timeout: 15000},
    );
  };
  const watchPosition = () => {
    try {
      const watchID = Geolocation.watchPosition(
        position => {
          setSpeed(position.coords.speed * 3.60934);
          calculate_speed(position.coords.speed * 3.60934);
          calculate_distance(position.coords);
        },
        error => alert('WatchPosition Error', JSON.stringify(error)),
      );
      setSubscriptionId(watchID);
    } catch (error) {
      alert('WatchPosition Error', JSON.stringify(error));
    }
  };

  const clearWatch = () => {
    if (subscriptionId !== null) {
      Geolocation.clearWatch(subscriptionId);
      setSubscriptionId(null);
      setSpeed(0)
    }
  };

  const calculate_speed = speed => {
    setSpeedObj(prev => ({
      ...prev,
      max_speed:
        speed >= prev.max_speed ? parseFloat(speed).toFixed(1) : prev.max_speed,
      avg_speed: parseFloat(
        (parseInt(prev.avg_speed) + parseInt(speed)) / 2,
      ).toFixed(1),
      
    }));
  };

  const calculate_distance = too => {
    getDistance({
      from: start_position,
      to: {lat: too.latitude, lng: too.longitude},
    }).then(distance => {
      setSpeedObj(prev => ({
        ...prev,
        distance: parseFloat(distance / 1000).toFixed(1),
      }));
    });
  };
  console.log(speed, "Speed");
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flexDirection: 'row',columnGap:10}}>
          <CustomHeader />
          <View style={{marginTop: 15}}>
            <Text style={{color: '#3972FE', fontSize: 15, fontWeight: '700'}}>
              Speedo{' '}
              <Text style={{color: '#1E1F4B', fontSize: 15, fontWeight: '700'}}>
                Meter
              </Text>
            </Text>
          </View>
        </View>
        {/* Speedo meter */}
        <View
          style={{
           flex:1,
           alignSelf: 'center',
            width:350,height:350
          }}>
           <Speedometer
            size={20}
            width={350}
            height={350}
            value={is_start? parseInt(speed):0}
            primaryArcWidth={5}
            max={240}
            color={'green'}
            min={0}
            step={5}
            rotation={225}
            angle={270}
            backgroundColor={'red'}
            fontFamily={fonts.Medium}>
              {/* <Background /> */}
              {/* <Marks lineColor='#0f9'  /> */}
            <Needle color={'#3972fe'}  />
            {/* <Progress /> */}

          </Speedometer>   
          <View style={{position:"absolute"}}> 
          <SpeedoMeterIcon width={350} height={350} />
          </View>
          {/* <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                width: 130,
                height: 130,
                top:100,
                borderRadius: 100,
                zIndex: -1000,
                backgroundColor: '#010408',
              }}></View> */}
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#1E1F4B',
              alignSelf: 'center',
              bottom:100,
              textAlign: 'center',
              fontFamily: fonts.Bold,
              fontWeight: '700',
            }}>
            {calculated_speed}
            {'\n'}Km/h
          </Text>
        </View>
        {/* <Text style={styles.kilometerText}>{speed_info.distance} km</Text> */}

        {/* speed buttons */}
        <View style={{margin:10}}>
          <View style={styles.buttonContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'center', gap: 5}}>
              <Text
                style={{
                  color: '#3972FE',
                  fontFamily: fonts.Bold,
                  fontWeight: 'bold',
                  fontSize: 24,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                {is_start? speed_info.avg_speed:0}
              </Text>
              <Text
                style={{
                  color: '#3972FE',
                  fontFamily: fonts.Bold,
                  fontWeight: 'bold',
                  fontSize: 10,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                Km/h
              </Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: '#1E1F4B',
                fontWeight: '700',
              }}>
             {selectedLanguage.averge_speed}
            </Text>
          </View>
          <View style={styles.buttonContainer1}>
            <View style={{flexDirection: 'row', justifyContent: 'center', gap: 5}}>
              <Text
                style={{
                  color: '#3972FE',
                  fontFamily: fonts.Bold,
                  fontWeight: 'bold',
                  fontSize: 24,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                {is_start ? speed_info.max_speed:0}
              </Text>
              <Text
                style={{
                  color: '#3972FE',
                  fontFamily: fonts.Bold,
                  fontWeight: 'bold',
                  fontSize: 10,
                  alignSelf: 'center',
                  marginTop:10
                }}>
                Km/h
              </Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: '#1E1F4B',
                fontWeight: '700',
              }}>
              {selectedLanguage.max_speed}
            </Text>
          </View>
        </View>
        {/* speed buttons */}
        <TouchableOpacity
          style={styles.StartButton}
          onPress={() => {
            if (!is_start) {
              getOneTimeLocation();
            } else {
              clearWatch();
            }
            setIsStart(!is_start);
            
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontFamily: fonts.Bold,
              fontWeight: 'bold',
              color: '#fff',
            }}>
            {' '}
            {is_start ? 'Pause' : `${selectedLanguage.start}`}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SpeedoMeterScreen;

const styles = StyleSheet.create({
  HumbergIcon: {
    margin: 15,
  },
  SpeedoMeterIconBlack: {
    justifyContent: 'center',
    alignSelf: 'center',
    // position: 'absolute',
    alignItems: 'center',
  },
  kilometerText: {
    fontSize: 24,
    color: '#1E1F4B',
    fontFamily: fonts.Bold,
    fontWeight: 'bold',
    position: 'absolute',
    alignSelf: 'center',
    top: 255,
  },
  buttonContainer: {
    width: wp('45%'),
    backgroundColor: '#F9F9F9',
    height: 80,
    borderRadius: 10,
    justifyContent:'center',
    alignItems:'center',
    position: 'absolute',
    bottom: 200,
  },
  buttonContainer1: {
    width: wp('45%'),
    backgroundColor: '#F9F9F9',
    height: 80,
    borderRadius: 10,
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    alignSelf: 'flex-end',
    bottom: 200,
    
  },
  StartButton: {
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    width: '95%',
    height: 60,
    backgroundColor: '#3972FE',
    borderRadius: 10,
    position: 'absolute',
    bottom: 125,
  },
});
