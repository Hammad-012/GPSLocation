import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import HumbergIcon from '../assests/svgs/Humberg.svg';
const CustomHeader = () => {
    const navigation = useNavigation()
  return (
    <TouchableOpacity  onPress={() => navigation.toggleDrawer() } style={{marginTop:15,marginLeft: 10,}}>
    <HumbergIcon width={30} height={30} style={styles.HumbergIcon} />
    </TouchableOpacity>
  )
}

export default CustomHeader

const styles = StyleSheet.create({})