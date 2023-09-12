// __mocks__/react-native-purchases.js

export const CustomerInfo = jest.fn();
export const PurchasesPackage = jest.fn();
export const LOG_LEVEL = {
  // Depending on the actual values in react-native-purchases, you can define them here.
  // For instance, if LOG_LEVEL has properties like ERROR, WARN, etc., you can define:
  ERROR: 'ERROR',
  WARN: 'WARN',
  // ... other log levels
};