import * as React from 'react';
import { Alert } from 'react-native';
import {createNativeStackNavigator, HeaderBackButton} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';

// Screen imports
import HomeScreen from './home';
import NotebookScreen from './notebookScreen';
import QueryScreen from './queryScreen';
import DrawingScreen from './drawingScreen';
import FirstScreen from './firstScreen';
import LoginScreen from './login';
import AdvancedSettingsScreen from './advancedSettings';
import UserSettingsScreen from './userSettings';
import SignupScreen from './signup';
import SubscriptionsScreen from './subscriptions';
import ForgotPasswordScreen from './forgotPassword';
import { RevenueCatProvider } from './revenueCatProvider';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const OutsideStack = createNativeStackNavigator();

const OutsideLayout = () => {
  return (
      <OutsideStack.Navigator
        screenOptions={{
          headerTransparent: true,    // Make the header transparent
          title: null,    // Hide the title
          headerBackTitleVisible: false,  // Hide the back title (if you want to)
          headerTintColor: 'black',   // Color of the back button
          cardStyle: { backgroundColor: 'transparent' },
          headerStyle: {
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="First" component={FirstScreen} options={{ title: null, }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: null, }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: null, }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: null, }} />
      </OutsideStack.Navigator>
  );
}



const InsideLayout = () => {
  return (
    <RevenueCatProvider>
    <InsideStack.Navigator
      screenOptions={{
        headerTransparent: true,    // Make the header transparent
        title: null,    // Hide the title
        headerBackTitleVisible: false,  // Hide the back title (if you want to)
        headerTintColor: 'black',   // Color of the back button
        cardStyle: { backgroundColor: 'transparent' },
        headerStyle: {
          borderBottomColor: 'transparent',
          shadowColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: null, headerShown : false }} />
      <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} options={{ title: null,}} />
      <Stack.Screen name="Notebook" component={NotebookScreen} options={{ title: null,}}/>
      <Stack.Screen name="Query" component={QueryScreen} options={{ title : null,}}/>
      <Stack.Screen name="UserSettings" component={UserSettingsScreen} options={{ title : null, }} />
      <Stack.Screen name="AdvancedSettings" component={AdvancedSettingsScreen} options={{ title : null, }} />
      <Stack.Screen name="Drawing" component={DrawingScreen} options={{ title: null, }}/>
    </InsideStack.Navigator>
    </RevenueCatProvider>
  );
}


const MyStack = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, [])
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="Outside">
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ title: null, }} />
        ) : (
          <Stack.Screen name="Outside" component={OutsideLayout} options={{ title: null, }} />
        )}
      </Stack.Navigator>
    // </NavigationContainer>
    
  );
};

export default MyStack;