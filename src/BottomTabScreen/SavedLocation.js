import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from '../constants/routes';
import {useDispatch} from 'react-redux';
import NavigationIcon from '../assests/svgs/NavigationIcon.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setinittialRoute} from '../store/actions/InittailRouteActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SavedLocation = () => {
  const dispatch = useDispatch();
  const [data,setData] = useState([])
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(setinittialRoute('savedlocation'));
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const DisplayData = async () => {
    try {
      const showdata = await AsyncStorage.getItem('locationData');
      console.log('show data', showdata);
      const parsedData = JSON.parse(showdata);
      setData(parsedData);
      console.log('parsed data', parsedData);
    } catch (error) {
      console.error('Error displaying data:', error);
    }
  };
  
  console.log('data', data);
  
  useEffect(() => {
    DisplayData();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
       <ScrollView  contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
          onPress={() => navigation.navigate(AuthRoutes.MainScreen)}>
          <LeftArrow width={20} height={20} style={styles.LeftArrowIcon} />
        </TouchableOpacity>
        <Text style={{color: '#3972FE', fontSize: 18, fontWeight: '700'}}>
          Saved{' '}
          <Text style={{color: '#1E1F4B', fontSize: 18, fontWeight: '700'}}>
            Location
          </Text>
        </Text>
      </View>
      <View style={styles.cardContainer}>
    {data.length > 0 &&  data.map((item, index) => (
     
    <View key={`${index}`} style={styles.card}>
      <View style={styles.cardContent}>
        <Text>
          Location Name:
          <Text style={styles.locationName}>
            {' '}
            {item?.address}
          </Text>
        </Text>
       <TouchableOpacity onPress={()=>navigation.navigate(AuthRoutes.navigatelocation,{latitude:item.latitude,longitude:item.longitude})}>
       <NavigationIcon />
       </TouchableOpacity>
      </View>
      <View style={styles.row}>
      <Text>{`Latitude: ${item?.latitude}`}</Text>
        <Text>{`Longitude: ${item?.longitude}`}</Text>
      </View>
      <View style={styles.address}>
      <Text>{`Address: ${item?.title}`}</Text>
      </View>
      <View style={styles.contactNumber}>
        <Text>Contact Number: {item?.contactNumber}</Text>
      </View>
      <View style={styles.contactNumber}>
        <Text>Contact Number: {item?.Note}</Text>
      </View>
    </View>
  ))}
</View>
</ScrollView>
      <TouchableOpacity
      onPress={()=>navigation.navigate(AuthRoutes.searchlocation)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}>
        <AntDesign name={'pluscircle'} color="#1E1F4B" size={40} />
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default SavedLocation;

const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    height:'40%',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    marginBottom: 20, 
    borderRadius: 10,
    padding: 10, 
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationName: {
    color: '#3972FE',
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  address: {
    marginLeft:5,
  },
  contactNumber:{
    marginTop:5,
    marginLeft: 10,
  }
});