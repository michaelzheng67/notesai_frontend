import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FirstScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes.ai</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#92D7FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
  },
  buttonText: {
    color: 'white',
    fontSize: 36,
  },
});

export default FirstScreen;