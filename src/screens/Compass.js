import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Image,
    Dimensions,
    Animated 
  } from 'react-native';
  
  import React, { useState, useEffect } from 'react';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {useNavigation} from '@react-navigation/native';
import fonts from '../constants/font';
import CompassImage from '../assests/images/compassss.png'
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CompassHeading from 'react-native-compass-heading';
import { useDispatch, useSelector } from 'react-redux';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
import { AuthRoutes } from '../constants/routes';
const { width, height } = Dimensions.get('window');
const Compass = () => {
    const navigation = useNavigation();
    const {location} = useSelector(state=>state.userReducer)
    const [heading, setHeading] = useState(0);
    const rotateValue = new Animated.Value(0);
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(setinittialRoute('compass'));
    }, []);
    useEffect(() => {
        const degreeUpdateRate = 1.5;
        CompassHeading.start(degreeUpdateRate, ({ heading, accuracy }) => {
            console.log("CompassHeading: ", heading, accuracy);
            setHeading(heading);
            Animated.timing(rotateValue, {
                toValue: heading,
                duration: 100,
                useNativeDriver: false,
            }).start();
        });
 
        return () => {
            CompassHeading.stop();
        };
    }, [heading]);
    const rotateStyle = {
        transform: [{ rotate: `${-heading}deg` }],
    };
 
    const getCardinalDirection = () => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index = Math.round(heading / 45) % 8;
        return directions[index];
    };
  return (
    <>
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          margin: 10,
          ...Platform.select({
            android: {
              marginTop: 25,
            },
          }),
        }}>
        <TouchableOpacity onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrow width={20} height={20} style={styles.LeftArrowIcon} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          Compass{' '}
        </Text>
      </View>
      <View style={{alignSelf:'center',marginTop:15}}>
      <Text style={styles.headingValue}>{`Heading: ${heading.toFixed(2)}°`}</Text>
        <Text style={{textAlign:'center',marginTop:10,fontFamily:fonts.Medium}}> {location.coords.latitude}, {location.coords.longitude}</Text>
      </View>
      <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Animated.Image
                    source={CompassImage}
                    style={[styles.compassImage, rotateStyle]}
                />
            </View>
            <Text style={styles.cardinalDirection} >{`Direction: ${getCardinalDirection()}`}</Text>
        
        {/* <TouchableOpacity style={{backgroundColor:'#3972FE',width:wp('90%'),height:hp('5%'),borderRadius:50,margin:15,marginTop:40}}>
            <Text style={{color:'#fff',textAlign:'center',fontSize:18,marginTop:10}}>100°5’35’’ N 120°2’1’’ W</Text>
        </TouchableOpacity> */}
    </SafeAreaView>
    </>
  )
}

export default Compass

const styles = StyleSheet.create({
    
    headingValue: {
        fontSize: 24,
        fontFamily:fonts.Bold,
        fontWeight:'700',
        marginTop: 10,
        color: "#555",
        textAlign:'center'
    },
    compassImage: {
        width: 300,
        height: 300,
    },
    cardinalDirection: {
        fontSize: 18,
        marginTop: 20,
        color: "#555",
        textAlign:'center'
    },
    LeftArrowIcon: {
        ...Platform.select({
          android: {
            marginTop: 2,
          },
        }),
      },
})