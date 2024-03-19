import { Dimensions,Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
export function isIphoneXorAbove() {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}

export default  async function isIphoneWithNotch() {
  
  let hasNotch = await DeviceInfo.hasNotch();
  console.log(hasNotch,"has Notcal");
  return hasNotch;
}