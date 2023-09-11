import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './mainNavigator'; // Import the AppNavigator component

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;