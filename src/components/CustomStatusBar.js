import { StyleSheet, Text, View ,StatusBar} from 'react-native'
import React from 'react'

const CustomStatusBar = ({backgroundColor, ...props}) => {
  return (
    <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props}  />
        </View>
  )
}

export default CustomStatusBar
const styles = StyleSheet.create({
   
});