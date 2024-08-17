import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import SignUp from '../auth/signup';
import SignIn from '../auth/signin';
import Home from '../home/home';
import QRGenerate from '../qrgenerate/qrgenerate';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        <Stack.Screen name="QRGenerate" options={{ headerShown: false }} component={QRGenerate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;