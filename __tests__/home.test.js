import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../src/home.js'; // Adjust the path accordingly

import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      // Add other navigation methods if needed
    })),
  };
});

import { useRevenueCat } from '../src/revenueCatProvider';

// Mock the hook
jest.mock('../src/revenueCatProvider', () => ({
  useRevenueCat: jest.fn(() => ({
    user: {
      // Mock user properties here
      id: 'mockUserId',
      name: 'mockUserName',
      // ... any other properties you expect
    }
  }))
}));

jest.mock("firebase/app", () => ({
  auth: jest.fn(() => ({
    currentUser: {
      uid: "mockUID"
    }
  }))
}));


describe('HomeScreen', () => {
  
  it('renders without crashing', () => {
    // Simply rendering the component to check if it crashes
    render(<HomeScreen />);
  });

});