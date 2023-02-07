import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Pressable, Alert, FlatList, TextInput } from 'react-native'; 
import { db, firestore, auth } from '../firebase-config';

const SetupPage = ({ navigation }) => {
  // useState() hooks creation for account setup handling.
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Beginning of arrow function to insert Owl Guard logo.
  const Item = ({ item }) => {
    return <View style={styles.item}>{item.icon}</View>;
  };
  // End of arrow function to insert Owl Guard logo.

  // Beginning of Page Heading.
  const itemData = [
    {
      icon: (
        <Pressable>
          <Text style={styles.backBtn}></Text>
        </Pressable>
      )
    },
    {
      icon: (
        <View style={styles.miniLogoCont}>
          <Image
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
            source={
              require('../assets/logo_white.png')
            }
          ></Image>
          <Text style={styles.miniLogoText}>OWL GUARD</Text>
        </View>
      )
    }
  ];
  // End of Page Heading.

  // Beginning of Storing User Registration Data on Fireabase function.
  function saveDataWithFirebase() {
    // Variable creation, stores current user's uid.
    var userId = auth.currentUser.uid;
    // Missing data validation. Validates if user typed a name and phone number.
    if (userName === '' || userPhone === '') {
      // Error Alert: Informs user if a field is empty.
      Alert.alert(
        'Error',
        '\nPlease fill in all fields.'
      )
      return;
  }
  // Invalid phone number validation. Validates if phone number typed is 10 digits long.
  else if (userPhone.length < 10 ){
    // Error Alert: Informs user if their phone number is not  digits long.
    Alert.alert(
      'Error',
      '\nPhone number must be 10 digits.'
    )
    return;
  }
  // If validations are passed.
  else {
    // Calls database reference, and sets the user's name and phone number values.
    db.ref('users/' + userId).set({
      // Sets user's name value.
      name: userName,
      // Sets user's phone number value.
      phone: userPhone
    });
    // Saves user's name and phone number values into the doc corresponding to the current userId on the users collection on Firestore.
    firestore.collection('users').doc(userId).set(
      {
        name: userName,
        phone: userPhone
      },
      // Allows to replace specified values in the data argument.
      { merge: true }
    )
    .then(() => {
      // Alert: Informs user that setup was completed.
      Alert.alert('Hey ' + userName + ', one more step!',
      '',
      [
        // Prompts user to continue to next screen of registration form.
        {text: 'Continue', onPress: () => navigation.navigate('EmergencyPage')}
      ])
    })
    // Error validation.
    .catch(function (error) {
      // Error Alert: Informs the user if an error occured while attempting to store the data.
      Alert.alert('Error');
    });
  }
  }
  // End of Storing User Registration Data on Fireabase function.

  // Beginning of return function, renders components.
  return (
    <View style={styles.body}>
        <View style={styles.topGrid}>
        <FlatList
          data={itemData}
          numColumns={4}
          renderItem={Item}
          keyExtractor={(item) => item.alt}
        />
        </View>
        <View style={styles.mainContent}>
          <View style={styles.separateBottom}>
            <Text style={styles.text}>Setup your Profile!</Text>
            <Text style={styles.text}>Enter your Name:</Text>
            {/* Value typed in name TextInput is stored in setUserName from useState() hook. */}
            <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Name' autoCorrect={false} spellCheck={false} onChangeText={(value) => setUserName(value)}></TextInput>
          </View>
          <View>
            <Text style={styles.text}>Enter your Phone Number:</Text>
            {/* Value typed in phone number TextInput is stored in setUserPhone from useState() hook. */}
            <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Phone Number' maxLength={10} dataDetectorTypes={'phoneNumber'} keyboardType={'numeric'} onChangeText={(value) => setUserPhone(value)}></TextInput>
          </View>
        </View>
        <View style={styles.footer}>
          {/* Pressable component calls saveDataWithFirebase() function. */}
          <Pressable style={styles.pressable} onPress={saveDataWithFirebase}>
            <Text style={styles.pressableText}>Continue</Text>
          </Pressable>
        </View>
    </View>
  );
}
// End of return function, renders components.

// Beginning of CSS styling.
const styles = StyleSheet.create({
  body: {
  flex: 1,
  backgroundColor: '#4C39BA',
  alignItems: 'center',
  justifyContent: 'center',
  },
  mainContent: {
    flex: 10
  },
  topGrid: {
    flex: 3,
    marginHorizontal: "auto",
    width: '100%',
    marginTop: 90
  },
  item: {
    flex: 1,
    maxWidth: '33%',
    alignItems: 'center'
  },
  miniLogoCont: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  miniLogoText: {
    color: "white",
    marginTop: 10
  },
  backBtn: {
    color: 'white',
    marginTop: 10,
    fontSize: 18
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
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
  separateBottom: {
    marginBottom: 50
  },
  footer: {
    height: 150,
    alignSelf: 'stretch'
  },
  pressable: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 60,
    borderRadius: '50%',
    width: '70%'
  },
  pressableText: {
    textAlign: 'center',
    alignItems: 'center',
    color: '#6C68DB',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
// End of CSS styling.

// Exports page.
export default SetupPage;