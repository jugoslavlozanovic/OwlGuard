import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Pressable, Alert, FlatList, TextInput } from 'react-native'; 
import { auth } from '../firebase-config'; 

const LoginPage = ({ navigation }) => {
  // useState() hooks creation for account login handling.
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Beginning of User Login Using Firebase arrow function.
  const loginWithFirebase = () => {
    // Uses auth.singInWithEmailAndPassword() method and the values stored in the useState() hooks.
    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
      .then(function (_firebaseUser) {
        // Alert: Informs user login was successful.
        Alert.alert('You have been logged in!',
      '',
      [
        // Prompts user to continue to account.
        {text: 'Continue', onPress: () => navigation.navigate('MapPage')}
      ])
      // Set LoggedIn status through useState() hook.
        setLoggedIn(true);
      })
      // Error validation.
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Password match validation.
        if (errorCode === 'auth/wrong-password') {
          // Error Alert: Informs user if password type does not match password stored in Firebase.
          Alert.alert('Wrong Password!');
        }
        // Existing user validation.
        else if (errorCode === 'auth/user-not-found') {
          // Error Alert: Informs user if the email is not recognized for an existing account, prompt user to verify the email typed or to register if they do not have an account.
          Alert.alert('Account not found.', 
          '\nVerify your email or register!'
          );
        }
        // Error Alert: Informs user if a different error occurs.
        else {
          Alert.alert(errorMessage);
        }
      }
      );
  }
  // Beginning of User Login Using Firebase arrow function.

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
          <View style={styles.separateBottom}>
            <Text style={styles.text}>Welcome back!</Text>
            <Text style={styles.text}>Enter your Email:</Text>
            {/* Value typed in email TextInput is stored in setLoginEmail from useState() hook. */}
            <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Email' autoComplete='email' autoCapitalize='none' autoCorrect={false} spellCheck={false} keyboardType={'email-address'} onChangeText= {(value) => setLoginEmail(value)}></TextInput>
          </View>
          <View>
            <Text style={styles.text}>Enter your Password:</Text>
            {/* Value typed in password TextInput is stored in setLoginPassword from useState() hook. */}
            <TextInput placeholderTextColor={'#6C68DB'} style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText= {(value) => setLoginPassword(value)}></TextInput>
          </View>
        </View>
        <View style={styles.footer}>
          {/* Pressable component calls loginWithFirebase() function. */}
          <Pressable style={styles.pressable} onPress={loginWithFirebase}>
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
export default LoginPage;