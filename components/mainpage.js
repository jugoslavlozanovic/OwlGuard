import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'; 

const MainPage = ({ navigation }) => {
  // Beginning of return function, renders components.
  return (
    <View style={styles.container}>
    <View style={styles.logoCont}>
      <Image style={styles.bigLogo} source={require('../assets/logo_white.png')}></Image>
      <Text style={styles.logoText}>OWL GUARD</Text>
    </View>
    <View style={styles.bottomCont}>
      <Text style={styles.introText}>A trustworthy app to keep you safe</Text>
      {/* Pressable component allows navigation to SingupPage. */}
      <Pressable style={styles.pressableOne} onPress={() => navigation.navigate('SignupPage')}>
        <Text style={styles.pressableText}>Get Started</Text>
      </Pressable>
      <View style={styles.signInCont}>
        <Text style={styles.tinyText}>Already have an account?</Text>
              {/* Pressable component allows navigation to LoginPage. */}
        <Pressable onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.yellowText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
    </View>
  );
};
// End of return function, renders components.

// Beginning of CSS styling.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C39BA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bigLogo: {
    height: 130,
    resizeMode: 'contain'
  },
  logoText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },
  logoCont: {
    flex: 1,
    marginTop: 250
  },
  bottomCont: {
    height: 250,
    alignSelf: 'stretch'
  },
  introText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  pressableOne: {
    width: '70%',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 60,
    borderRadius: '50%',
    marginTop: 60,
    alignSelf: 'center'
  },
  pressableText: {
    textAlign: 'center',
    alignItems: 'center',
    color: '#6C68DB',
    fontSize: 18,
    fontWeight: 'bold'
  },
  signInCont: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  tinyText: {
    color: 'white',
    fontSize: 15
  },
  yellowText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 3,
    color: '#FFFF7E'
  }
});
// End of CSS styling.

// Exports page.
export default MainPage;