const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
import { getContactsByPhoneNumber } from "react-native-contacts";
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
import countries_coordinates from '../data/countries_captills_coordinates.json';
export const SearchNumberValidation = (mobile_number,country) => {
    return new Promise((resolve,reject)=>{
        try {
            let rawnumber = phoneUtil.parseAndKeepRawInput(
                mobile_number,
                country.code
            )
            if(phoneUtil.sValidNumberForRegion(rawnumber,country.code)){
                let found_item = countries_coordinates.find(
                    x=>x.ios2 === country.code
                );
                let item = {
                    number:`${mobile_number}`,
                    country: country,
                    data:found_item
                }
                resolve(item)
            }
            else {
                reject({
                    status:false,
                    error:'Please enter a valid number'
                })
            }
        } catch (err) {
            reject({status: false, error: 'Please enter a valid mobile number'});
        }
    })
}

export const search_mobileNumber = number => {
    return new Promise((resolve,reject)=>{
        checkMultiple([PERMISSIONS.IOS.CONTACTS]).then(status =>{
            if(status['ios.permission.CONTACTS'] === 'granted'){
                getContactsByPhoneNumber(`${number}`)
                .then(data => {
                    if(data.length > 0 ) {
                        resolve({
                            displayName:`${data[0].familyName} ${data[0].givenName}`
                        });
                    }
                    else {
                        reject({
                            displayName: 'No Contact Permission',
                          });
                    }
                    
                })
                .catch(err => {
                    reject({
                        displayName: 'No Contact Permission',
                      });
                })
            }
            else {
                reject({
                    displayName: 'No Contact Permission',
                  });
            }
        })
    })
}
export const SearchNumberValidationIOS = (mobile_number, country) => {
    return new Promise((resolve,reject)=>{
        try {
            let rawnumber = phoneUtil.parseAndKeepRawInput(
                mobile_number,
                country.code,
            )
            if (phoneUtil.isValidNumberForRegion(rawnumber, country.code)) {
                let item = {
                  number: `${mobile_number}`,
                  country: country,
                };
                resolve(item);
            }
            else {
                reject({
                  status: false,
                  error: 'Please enter a valid mobile number',
                });
            }
        } catch (error) {
            reject({status: false, error: 'Please enter a valid mobile number'});
        }
    })
}