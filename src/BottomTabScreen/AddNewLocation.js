import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import React, { useEffect,useState } from 'react';
import LeftArrow from '../assests/svgs/LeftArrow.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import { AuthRoutes } from '../constants/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationIcon from '../assests/svgs/NavigationIcon.svg';
import NewLocationIcon from '../assests/svgs/NewLocation.svg'
import fonts from '../constants/font';
import { useDispatch,useSelector } from 'react-redux';
import { setinittialRoute } from '../store/actions/InittailRouteActions';
const AddNewLocation = () => {
  const navigation = useNavigation();
  const {selectedLanguage} = useSelector(state=>state.languageReducer)
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
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
 useEffect(()=>{
  dispatch(setinittialRoute("AddNewLocation"))
 },[])
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={styles.scrollView}
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
    {data && data.length > 0 ? data.map((item, index) => (
     
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
  )):(
    <>
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
      </View>
      <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:70}}>
           <NewLocationIcon />
           <Text style={{marginTop:20}}>{selectedLanguage.you_have_not_added_location} </Text>
           <TouchableOpacity style={{backgroundColor:'#3972FE',width:'80%',height:45,borderRadius:8,marginTop:20}} onPress={()=>navigation.navigate(AuthRoutes.searchlocation)}>
            <Text style={{color:'#fff',textAlign:'center',fontFamily:fonts.Bold,fontWeight:'700',marginTop:10}}>{selectedLanguage.Add_place}</Text>
           </TouchableOpacity>
      </View>
      </>
  )}
</View>
</ScrollView>
      {data && data.length > 0 ? (
        <TouchableOpacity
        onPress={()=>navigation.navigate(AuthRoutes.searchlocation)}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}>
          <AntDesign name={'pluscircle'} color="#1E1F4B" size={40} />
        </TouchableOpacity>
      ):(
        <View></View>
      )}
    </SafeAreaView>
  );
};

export default AddNewLocation;

const styles = StyleSheet.create({
  LeftArrowIcon: {
    ...Platform.select({
      android: {
        marginTop: 2,
      },
    }),
  },
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
