/* 
Mobile Development Final Project

App Name: Owl Guard
Group Members: Ivan Rendon, Jerome Bautista, Jugoslav Lozanovic
*/

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './components/login';
import Signup from './components/signup';
import MainPage from './components/mainpage';
import SetupPage from './components/setup';
import EmergencyPage from './components/emergency'; 
import MapPage from './components/mappage';

// Navigation Stack creation.
const Stack = createStackNavigator();
const MyStack = () => {
  // Beginning of return function, renders components.
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
          <Stack.Screen 
          options={{ title: '',               
          presentation: 'transparentModal',
          animationTypeForReplace: 'push',
          animation:'slide_from_right' }} name="Home" component={MainPage}/>
          <Stack.Screen  
          options={{ title: '',               
              presentation: 'transparentModal',
              animationTypeForReplace: 'push',
              animation:'slide_from_right' }}  name="SignupPage" component={Signup} />
          <Stack.Screen 
          options={{ title: '',               
              presentation: 'transparentModal',
              animationTypeForReplace: 'push',
              animation:'slide_from_right' }} name="LoginPage" component={LoginPage} />
          <Stack.Screen 
          options={{ title: '',               
          presentation: 'transparentModal',
          animationTypeForReplace: 'push',
          animation:'slide_from_right' }} name="SetupPage" component={SetupPage} />
          <Stack.Screen 
          options={{ title: '',               
          presentation: 'transparentModal',
          animationTypeForReplace: 'push',
          animation:'slide_from_right' }} name="EmergencyPage" component={EmergencyPage} />
          <Stack.Screen 
          options={{ title: '',               
          presentation: 'transparentModal',
          animationTypeForReplace: 'push',
          animation:'slide_from_right' }} name="MapPage" component={MapPage} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};
// End of return function, renders components.

// Exports page.
export default MyStack;