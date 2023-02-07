import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps'; 
import { StyleSheet, Text, View, Pressable, Alert, Dimensions } from 'react-native';
import { firestore, auth } from '../firebase-config';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';

const MapPage = ({ navigation }) => {
  // useState() hooks creation for initial location.
  const [mapRegion, setMapRegion] = useState({
    // Setting coordinates for initial map location.
    latitude: 42.983500,
    longitude: -81.250900,
    // latitudeDelta and longitudeDelta set the zoom on the map.
    latitudeDelta: 0.0002,
    longitudeDelta: 0.0030
  });
  const [databaseData, setDatabaseData] = useState('');
  const [fullAddress, setFullAddress] = useState([
    {
      // Setting properties for ull address.
      "city": "",
      "country": "",
      "district": "",
      "isoCountryCode": "",
      "name": "",
      "postalCode": "",
      "region": "",
      "street": "",
      "streetNumber": "",
      "subregion": "",
      "timezone": "",
    }
  ]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [batteryInfo, setBatteryInfo] = useState('');

  // Beginning of User Location (live) arrow function, fetches user location.
  const userLocation = async () => {
    // Requests permission to fetch user's location.
    let {status} = await Location.requestForegroundPermissionsAsync();
    // Verifies if user granted permission.
    if (status !== 'granted') {
      // Error Message: If user does not grand permission to location error message is shown.
      setErrorMsg('Permission to access location was denied!');
    }
    // Variable storing current location created. High Accuracy property set to true to fetch the most precise location data possible.
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true});
      // setMapRegion from useState() hook is updated from initial map location to user's current latitude and longitude.
      setMapRegion({
        // Setting latitude and longitude by accessing location properties.
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // latitudeDelta and longitudeDelta set the zoom on the map.
        latitudeDelta: 0.0002,
        longitudeDelta: 0.0030
      });    
    // Variable storing the user's location on plain text i.e. 500 Main St London ON N5V 4Y5 is created.
    // Uses reverseGeocodeAsync function to obtain user's location in plain text by passing the location.coords, this returns a JSON object with the location data.
    let address = await Location.reverseGeocodeAsync(location.coords);
    // setFullAddress from useState() hook is updated from initial state (empty strings) to values obtained from JSON object.
    setFullAddress(address);
    return;
  }
  // End of User Location (live) arrow function, fetches user location.

// useEffect hook used to run functions once page is rendered.
useEffect(() => {
  // Calls userLocation() function.
    userLocation();
    // Asyncronous Function to check battery availability.
    async function checkAvailability() {
      // Constant to store battery availability status. Uses Battery.isAvailableAsync() function.
        const isBatteryAvailable = await Battery.isAvailableAsync();
        // setAvailable from useState() hook is updated to value stored in isBatteryAvailable constant (boolean).
        setIsAvailable(isBatteryAvailable);
      }
      // Calls checkAvailability(), loadBatteryInfo(), and retrieveDataFromFirebase() functions.
      checkAvailability();
      loadBatteryInfo();
      retrieveDataFromFirebase();
  }, []);

  // Constant storing battery info throught asyncronous arrow function.
  const loadBatteryInfo = async () => {
    // Variable storing battery state. Uses Battery.getPowerStateAsync() function.
    let batteryInfoLoaded = await Battery.getPowerStateAsync();
    // setBatteryInfo from useState() hook is updated to values stored in batteryInfoLoaded constant.
    setBatteryInfo(batteryInfoLoaded);
  };

  // Constant storing full address (location). Obtained by parsing JSON object and stringifying the data fields.
const fullAddressLine = JSON.parse(JSON.stringify(fullAddress[0].name)) + " \n" + JSON.parse(JSON.stringify(fullAddress[0].city)) + " " + JSON.parse(JSON.stringify(fullAddress[0].region)) + " \n" + JSON.parse(JSON.stringify(fullAddress[0].postalCode));

// Constant storing shorten address (used to display current address location on account screen). Obtained by parsing JSON and stringifying the data fields.
// This is the address used for SMS and Email messages.
const addressLine = JSON.parse(JSON.stringify(fullAddress[0].name)) + " " + JSON.parse(JSON.stringify(fullAddress[0].city)) + " " + JSON.parse(JSON.stringify(fullAddress[0].region)) + " " + JSON.parse(JSON.stringify(fullAddress[0].postalCode));

// Beginning of Data Retrieval from Firebase function.
function retrieveDataFromFirebase() {
  // Variable creation, stores current user's uid.
  var userId = auth.currentUser.uid;
  // Retrieves user's name, emergency contact name, emergency contact phone number, and emergency contact email values corresponding to the current user logged in.
  firestore.collection("users").doc(userId).get()
      .then(function (doc) {
        // Verifies that doc exists.
        if (doc.exists) {
          // setDatabaseData from useState() hook is updated with the values obtained from the retrieval.
          setDatabaseData({emergencyPhone: doc.data().emergencyPhone, userName: doc.data().name, emergencyName: doc.data().emergencyName, emergencyEmail: doc.data().emergencyEmail});
        } 
        else {
        }
      })
      // Error validation.
      .catch(function (error) {
      });
}
// End of Data Retrieval from Firebase function.

// Variable storing message. This message will be autopopulated on SMS and Email alerts.
var message = 'Hey ' + databaseData.emergencyName + ', ' + databaseData.userName +' needs your help! They are located at ' + addressLine + '. Their battery life is at ' + Math.floor(batteryInfo.batteryLevel * 100) + '%.';

// Beginning of Send SMS Message asynchronous arrow function. 
const sendSmsMessage = async () => {
  // Constant storing SMS Composer availability state.
  const isAvailable = await SMS.isAvailableAsync();
  // Validation of SMS composer availability state.
  if(isAvailable) {
    // If SMS Composer is available the SMS.sendSMSAsync fucntion is called.
    const { result } = await SMS.sendSMSAsync(
      // Emergency contact phone number stored in databaseData from useState() hook is passed.
      [databaseData.emergencyPhone],
      // Variale storing message is passed.
      message
    );
    // Validates if the SMS was sent successfully.
    if(result === 'sent') {
      // Alert: Informs user that SMS was sent successfully.
      Alert.alert(
        'SMS Sent',
        '',
        [
        // Alert Option: Allows to close alert.
          { text: 'Close' }
        ]
      )
    }
    // Informs user if SMS was not sent.
    else {
      Alert.alert(
        'SMS Cancelled',
        '',
        [
        // Alert Option: Allows to close alert.
          { text: 'Close' }
        ]
      )
    }
  }
}
// End of Send SMS Message asynchronous arrow function. 

// Beginning of Send Email Message asynchronous arrow function. 
const sendEmailMessage = async () => {
  // Constant storing Mail Composer availability state.
  const isAvailable = await MailComposer.isAvailableAsync();
  // Validation of SMS composer availability state.
  if(isAvailable) {
    // If Mail Composer is available the email, subject, and message for the email are set.
    var options = {
      // Emergency contact email stored in databaseData from useState() hook is passed.
      recipients: [databaseData.emergencyEmail],
      // Hard coded subject line and user's name stored in databaseData from useState() hook is passed.
      subject: 'Emergency Alert | ' + databaseData.userName,
      // Variale storing message is passed onto the email body.
      body: message
    };
    // Function calls MailComposer.composeAsync() function, takin the options as parameters and fulfilling a promise.
    MailComposer.composeAsync(options).then((result) => {
      // Validates if the SMS was sent successfully.
      if(result.status === 'sent') {
        // Alert: Informs user that Email was sent successfully.
        Alert.alert(
          'Email Sent',
          '',
          [
          // Alert Option: Allows to close alert.
            { text: 'Close' }
          ]
        )
      }
      // Informs user if Email was not sent.
      else {
        Alert.alert(
          'Email Cancelled',
          '',
          [
          // Alert Option: Allows to close alert.
            { text: 'Close' }
          ]
        )
      }
    });
  }
}
// End of Send Email Message asynchronous arrow function. 

// Beggining of Signing Out Confirmation arrow function.
const confirmSigningOut = () => 
  // Alert: Confirms if user wants to sign out from account.
  Alert.alert(
  'Are you sure you want to sign out?',
  '',
  [
    // Alert Option: to close alert.
    {text: 'YES', 
    // When alert option YES is pressed, signOutWithFirebase() fucntion is called.
    onPress: () => signOutWithFirebase()
    },
    // Alert Option: Closes alert, user remains in account.
    {text: 'NO',
    }   
  ]);
// End of Signing Out Confirmation arrow function.

// Beggining of Signing Out asynchronous arrow function.
const signOutWithFirebase = async () => {
  // Uses auth.signOut() method.
  auth.signOut().then(function () {
    // Verifies if currentUser is not logged in.
    if (!auth.currentUser) {
      // Alert: Informs user sign out was successful.
      Alert.alert('You have been signed out!',
      '',
      [
        // Alert Option: to close alert.
        {text: 'OK', 
        // When alert option OK is pressed, user is redirected to Home screen.
        onPress: () => navigation.navigate('Home')}
      ]);
    }
  });
}
// Beggining of Signing Out asynchronous arrow function.

// Beginning of return function, renders components.
return (
    <View style={styles.body}>
        <View>
            <MapView style={styles.map} region={mapRegion} userInterfaceStyle={'dark'} mapType={'terrain'} showsUserLocation={true} loadingEnabled>
            </MapView>
        </View>
        <View style={styles.footer}>          
              <Text style={styles.text}><Text style={styles.textMain}>Address:</Text> {fullAddressLine}</Text>
              {/* Pressable component calls userLocation() function. */}
              <Pressable style={styles.pressable2} onPress={userLocation}>
                <Text style={styles.pressableText2}>Reload Address</Text>
              </Pressable>
              <View  style={styles.battery}>
                <Text style={styles.text}>{isAvailable ? "" : "Battery info unavailable"}</Text>
                {/* Text component displays Low Power Mode status on phone. */}
                <Text style={styles.text}><Text style={styles.textMain}>Low Power Mode:</Text> {batteryInfo.lowPowerMode ? "Yes" : "No"}</Text>
                {/* Text component displays phone's battery %. */}
                <Text style={styles.text}><Text style={styles.textMain}>Battery Level:</Text> {Math.floor(batteryInfo.batteryLevel * 100)}%</Text>
              </View>
              {/* Pressable component calls sendSmsMessage asynchronous function. */}
              <Pressable style={styles.pressable} onPress={sendSmsMessage}>
                <Text style={styles.pressableText}>Send SMS Alert</Text>
              </Pressable>
              {/* Pressable component calls sendEmailMessage asynchronous function. */}
              <Pressable style={styles.pressable} onPress={sendEmailMessage}>
                <Text style={styles.pressableText}>Send Email Alert</Text>
              </Pressable>
              {/* Pressable component calls confirmSigningOut asynchronous function. */}
              <Pressable style={styles.pressable2} onPress={confirmSigningOut}>
                <Text style={styles.pressableText2}>Sign Out</Text>
              </Pressable>
        </View>
    </View>
  );
}
// End of return function, renders components.

// Beginning of CSS styling.
const styles = StyleSheet.create({
  body: {
  flex: 2,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  },
  mainContent: {
    flex: 10
  },
  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    height: 50,
    color: '#FFFF7E',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  footer: {
    flex: 2,
    height: 150,
    alignSelf: 'stretch',
    marginTop: 40
  },
  pressable: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C68DB',
    height: 50,
    borderRadius: '50%',
    width: '70%',
    marginBottom: 10
  },
  pressableText: {
    textAlign: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  pressable2: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 60,
    borderRadius: '50%',
    width: '70%',
    marginBottom: 10
  },
  pressableText2: {
    textAlign: 'center',
    alignItems: 'center',
    color: '#6C68DB',
    fontSize: 18,
    fontWeight: 'bold'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  textMain: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500'
  },
  battery: {
    marginBottom: 30
  }
});
// End of CSS styling.

// Exports page.
export default MapPage;