import React from "react";
import {View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
const route_data = [
    {
      id: '1',
      label: 'Home',
      route: `Home`,
      type: 'route',
      icon: (
        <View style={style}>
          <Icon name="home" color={'#3972FE'} size={22} />
        </View>
      ),
    },
  
    {
      id: '3',
      label: 'Share App',
      type: 'function_call',
      route: `shareApp`,
      icon: (
        <View style={style}>
          <Icon
            name="share-social-sharp"
            color={"#3972FE"}
            size={22}
          />
        </View>
      ),
    },
  
    {
      id: '4',
      label: 'Privacy Policy',
      route: `privacyPolicy`,
      type: 'function_call',
      icon: (
        <View style={style}>
          <Icon
            name="document-text"
            color={"#3972FE"}
            size={22}
          />
        </View>
      ),
    },
    {
      id: '5',
      label: 'End User License Agreement (EULA)',
      route: `ELUA`,
      type: 'function_call',
      icon: (
        <View style={style}>
          <Icon
            name="document-text"
            color={"#3972FE"}
            size={22}
          />
        </View>
      ),
    },
    {
      id: '6',
      label: 'Rate Us',
      route: `rateUs`,
      type: 'function_call',
      icon: (
        <View style={style}>
          <Icon
            name="star-half-sharp"
            size={22}
            color={"#3972FE"}
          />
        </View>
      ),
    },
  ];
  
  const style = {
    width: wp(6),
    height: wp(6),
  };
  
  export default route_data;
  