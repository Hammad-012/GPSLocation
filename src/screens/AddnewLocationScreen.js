import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Switch,
  TextInput,
  ScrollView,
} from 'react-native';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import EditIcon from '../assests/svgs/EditIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
import { updateLocationAlert } from '../store/actions/locationAlertAction';
import fonts from '../constants/font';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { AuthRoutes } from '../constants/routes';
const AddnewLocationScreen = () => {
  const [isEnabledinside, setIsEnabledinside] = useState(false);
  const [isEnabledoutside, setIsEnabledoutside] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedRadius, setEditedRadius] = useState('');
  const [editIndex, seteditIndex] = useState(null)

  const { alerts } = useSelector(
    (state) => state.locationAlertReducer
  );

  console.log('alerts',alerts)
 
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(setinittialRoute('addnewlocationscreen'));
   
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); 
    return date.toLocaleString(); 
  };

  const toggleSwitchinside = () =>
    setIsEnabledinside((previousState) => !previousState);

  const toggleSwitchoutside = () =>
    setIsEnabledoutside((previousState) => !previousState);

  const handleEdit = (item, index) => {
    seteditIndex(index)
    setEditingLocation(item);
    setEditedName(item.name);
    setEditedRadius(item.radius);
    navigation.navigate(AuthRoutes.updateLocation,{index,item})
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
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
        <TouchableOpacity
          onPress={() => navigation.navigate(AuthRoutes.adplacescreen)}>
          <LeftArrow width={20} height={20} style={styles.LeftArrowIcon} />
        </TouchableOpacity>
        <Text style={{ color: '#3972FE', fontSize: 18, fontWeight: '700' }}>
          Add New{' '}
          <Text style={{ color: '#1E1F4B', fontSize: 18, fontWeight: '700' }}>
            Location
          </Text>
        </Text>
      </View>
      {alerts.map((item, index) => {
        return (
          <View key={`${index}`} style={styles.cardContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 10,
              }}>
              <Text style={{ fontFamily: fonts.Bold, fontWeight: '700' }}>
                Station Name:
                <Text style={{ fontFamily: fonts.Bold, color: '#3972FE' }}>
                  {item?.name}
                </Text>
              </Text>
              <TouchableOpacity onPress={() => handleEdit(item, index)}>
                <EditIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 5,
              }}>
              <Text style={{ fontSize: 8, fontFamily: fonts.Regular, marginLeft: 5 }}>
                Radius
              </Text>
              <Text style={{ fontSize: 10, fontFamily: fonts.Regular, color: '#3972FE' }}>
                {item?.radius} Sq.Meter
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 5,
              }}>
              <Text style={{ fontSize: 8, fontFamily: fonts.Regular, marginLeft: 5 }}>
                Moving inside Date&Time
              </Text>
              <Text style={{ fontSize: 8, fontFamily: fonts.Regular, marginLeft: 5 }}>
                {formatDate(item?.timestamp)}
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: 'green' }}
                thumbColor={item?.is_notify_on_arrival ? '#E8F5E9' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchinside}
                value={item?.is_notify_on_arrival}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 5,
              }}>
              <Text style={{ fontSize: 8, fontFamily: fonts.Regular, marginLeft: 5 }}>
                Moving outside Date&Time
              </Text>
              <Text style={{ fontSize: 8, fontFamily: fonts.Regular, marginLeft: 5 }}>
                {formatDate(item?.timestamp)}
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: 'green' }}
                thumbColor={item?.is_notify_on_exit ? '#E8F5E9' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchoutside}
                value={item?.is_notify_on_exit}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </View>
            
          </View>
          
        );
      })}
      {/* {editingLocation && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Enter location name"
          />
          <TextInput
            style={styles.input}
            value={editedRadius}
            onChangeText={setEditedRadius}
            keyboardType="numeric"
            placeholder="Enter radius"
          />
          <TouchableOpacity style={styles.updateButton} onPress={()=>handleUpdate(editingLocation)}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddnewLocationScreen;

const styles = StyleSheet.create({
  LeftArrowIcon: {
    ...Platform.select({
      android: {
        marginTop: 2,
      },
    }),
  },
  cardContainer: {
    margin: 10,
    alignSelf: 'center',
    backgroundColor: '#f9f9f9',
    width: wp('95%'),
    height: hp('18%'),
    borderRadius: 10,
  },
  editContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: '#3972FE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.Bold,
  },
});
