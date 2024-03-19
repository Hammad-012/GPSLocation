import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import fonts from '../constants/font';
import {useDispatch} from 'react-redux';
import { AuthRoutes } from '../constants/routes';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import { deleteTrack } from '../store/actions/trackAction';
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from 'react-native-responsive-screen';
const HistoryItem = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const animatedController = useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = useState(100);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', `${Math.PI}rad`],
  });

  const toggleListItem = () => {
    if (open) {
      Animated.timing(animatedController, {
        duration: 500,
        toValue: 0,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 500,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
    setOpen(!open);
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => toggleListItem()}
        style={styles.headingTextView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{marginLeft: 20}}>
            <Text style={styles.headingText}>
              Date & Time : {item.date} {item.time}
            </Text>
            <Text style={styles.headingText}>Track Name: {item.name}</Text>
            <Text style={styles.headingText}>Duration: {item.duration}</Text>
          </View>
        </View>
        <Animated.View style={{transform: [{rotateZ: arrowAngle}]}}>
          <Entypo
            name={'chevron-small-down'}
            color={'#000'}
            size={24}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{
          backgroundColor: '#fff',
          width: wp(100) - 20,
          paddingHorizontal: 0,
          height: bodyHeight,
          zIndex: 10,
          overflow: 'hidden',
        }}>
        <View
          style={styles.bodyContainer}
          onLayout={event => {
            setBodySectionHeight(event.nativeEvent.layout.height);
          }}>
          <View style={styles.start_end_row}>
            <View>
              <View
                style={{...styles.start_end_row, width: wp(100) -30 / 1.2}}>
                <Text style={{...styles.headingText, width: 30}}>
                  Start
                </Text>
                <Text numberOfLines={2} style={styles.detailsText}>
                  {item.start_address}
                </Text>
              </View>
              <View
                style={{...styles.start_end_row, width:  wp(100) -30/ 1.2}}>
                <Text style={{...styles.headingText, width: 30}}>
                  End
                </Text>
                <Text numberOfLines={2} style={styles.detailsText}>
                  {item.end_address}
                </Text>
              </View>
            </View>
            <View
              style={{
                width:  wp(100) -30/ 7,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    AuthRoutes.history,
                    item,
                  )
                }
                style={{width: 20, height: 30}}>
                <Feather name={'map'} color={'#000'} size={18} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => dispatch(deleteTrack(item))}
                style={{width: 20, height: 30}}>
                <Feather
                  name={'trash'}
                  color={'#000'}
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              ...styles.start_end_row,
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <TouchableOpacity style={styles.durationBox}>
              <Text
                style={{
                  marginLeft: 5,

                  ...styles.headingText,
                  color: '#fff',
                }}>
                Distance
              </Text>

              <Text
                style={{
                  ...styles.headingText,
                  color: '#fff',
                  marginTop: 2,
                  marginLeft: 5,
                }}>
                {item.distance}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.durationBox}>
              <Text
                style={{
                  ...styles.headingText,
                  color: '#fff',
                  marginLeft: 5,
                }}>
                Duration
              </Text>

              <Text
                style={{
                  ...styles.headingText,
                  color: '#fff',
                  marginTop: 2,
                  marginLeft: 5,
                }}>
                {item.duration}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.durationBox}>
              <Text
                style={{
                  ...styles.headingText,
                  color: '#fff',
                  marginLeft: 5,
                }}>
                Avg Speed
              </Text>

              <Text
                style={{
                  ...styles.headingText,
                  color: '#fff',
                  marginTop: 2,
                  marginLeft: 5,
                }}>
                {item.avg_speed}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomColor: '#f9f9f9',
    borderBottomWidth: 2,
    margin: 10,
    borderRadius: 10,
    padding: 5,
   
  },
  bodyContainer: {
    minHeight: 100,
    alignSelf: 'center',
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
  },
  header: {
    fontSize: 16,
    color: '#fff',
    fontFamily: fonts.Bold,
    margin: wp(2),
    borderRadius: wp(1),
    padding: wp(2),
  },
  detailsText: {
    paddingHorizontal: 15,
    color: 'green',
    fontFamily: fonts.Medium,
    fontSize: 12,
  },
  headingTextView: {
    backgroundColor: '#fff',
    padding: wp(2),
    borderRadius: wp(0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    includeFontPadding: false,
    fontFamily: fonts.SemiBold,
    fontSize: 11,
    color: 'black',
  },
  start_end_row: {
    flexDirection: 'row',
    overflow: 'hidden',
    width:  wp(100) -30 - 10,
    alignItems: 'center',
  },
  durationBox: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: 'blue',
    borderColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
