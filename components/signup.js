import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Pressable, Alert, FlatList, TextInput, KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase-config'; 

const Signup = ({ navigation }) => {
  // useState() hooks creation for account registration handling.
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [confirmRegistrationPassword, setConfirmRegistrationPassword] = useState('');

  // Beginning of User Registration Using Firebase arrow function.
  registerWithFirebase = () => {
    // Email length validation.
    if (registrationEmail.length < 4) {
      // Error Alert: Informs user if email is already in use or if the email is invalid due to wrong formatting.
      Alert.alert(
        'Invalid Email Address!',
        '\nEmail Address is in use or invalid.'
      );
      return;
    }
    // Password length validation.
    if (registrationPassword.length < 6) {
      // Error Alert: Informs user if password is not long enough, a minimum of 6 characters is required.
      Alert.alert(
        'Invalid Password!',
        '\n- Password must be at least 6 characters long.'
      );
      return;
    }
    // Password match validation.
    if (registrationPassword !== confirmRegistrationPassword) {
      // Error Alert: Informs user if passwords do not match.
      Alert.alert(
      'Passwords do not match!',
      '\nTry again.'
      );
      return;
    }
  // End of User Registration Using Firebase.

    // Beginning of User Creation on Firebase.
    // Uses auth() method and the values stored in the useState() hooks.
    auth.createUserWithEmailAndPassword(registrationEmail, registrationPassword)
      .then(function (_firebaseUser) {
        // Alert: Informs user registration was completed.
        Alert.alert(
          'Registration Complete!',
          '',
          [
            // Prompts user to continue to next screen of registration form.
            {text: 'Continue', onPress: () => navigation.navigate('SetupPage')}
          ]);
        // Clears the values set in the hooks.
        setRegistrationEmail('');
        setRegistrationPassword('');
      })
      // Error validation.
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Password strenght validation.
        if (errorCode == 'auth/weak-password') {
          // Error Alert: Informs user if the password is weak.
          Alert.alert(
            'The password is too weak.',
            '\nUse a combination of letters and numbers.');
        }
        // Error Alert: Informs user if a different error occurs.
        else {
          Alert.alert(errorMessage);
        }
      }
      );
  }
  // End of User Creation on Firebase.

  // Beginning of arrow function to insert Owl Guard logo.
  const Item = ({ item }) => {
    return <View style={styles.item}>{item.icon}</View>;
  };
  // End of arrow function to insert Owl Guard logo.

  // Beginning of Page Heading.
  const itemData = [
    {
      icon: (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
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
          <KeyboardAvoidingView behavior='padding'>
            <View style={styles.separateBottom}>
              <Text style={styles.text}>Let's get started!</Text>
              <Text style={styles.text}>Enter your Email:</Text>
              {/* Value typed in email TextInput is stored in setRegistrationEmail from useState() hook. */}
              <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Email' autoComplete='email' autoCapitalize='none' autoCorrect={false} spellCheck={false} keyboardType={'email-address'} onChangeText= {(value) => setRegistrationEmail(value)}/>
            </View>
            <View style={styles.separateBottom}>
              <Text style={styles.text}>Create a Password:</Text>
              {/* Value typed in email TextInput is stored in setRegistrationPassword from useState() hook. */}
              <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText={(value) => setRegistrationPassword(value)}/>
            </View>
             <View style={styles.separateBottom}>
              <Text style={styles.text}>Confirm Password:</Text>
              {/* Value typed in email TextInput is stored in setConfirmRegistrationEmail from useState() hook. */}
              <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Confirm Password' secureTextEntry={true} onChangeText={(value) => setConfirmRegistrationPassword(value)}/>
            </View>
          </KeyboardAvoidingView>
          </View>
          <View style={styles.footer}>
            {/* Pressable component calls registerWithFirebase() function. */}
            <Pressable style={styles.pressable} onPress={registerWithFirebase} >
              <Text style={styles.pressableText}>Register</Text>
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
export default Signup;