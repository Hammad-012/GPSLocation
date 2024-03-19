import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
const checkPermission = () => {
  return new Promise((resolve, reject) => {
    checkMultiple([
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]).then(stateus => {
      if (
        stateus['ios.permission.LOCATION_ALWAYS'] !== 'granted' &&
        stateus['ios.permission.LOCATION_WHEN_IN_USE'] !== 'granted'
      ) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

export default checkPermission;
