import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from "./firebaseConfig"; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () =>{
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.log(error);
        console.log("failed sign in");
      }
    }


    return (
    // <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
          <Text style={styles.title}>Notes.ai Login</Text>

          <TextInput style={styles.input} value={email} placeholder='email' placeholderTextColor='grey' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
          <TextInput style={styles.input} secureTextEntry={true} value={password} placeholder='password' placeholderTextColor='grey' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => signIn()}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={{ textDecorationLine: 'underline', fontSize: 24, marginTop: 30 }}>
                Forgot your password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ textDecorationLine: 'underline', fontSize: 24, marginTop: 15 }}>
                Don't have an account? Sign Up
            </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    // </View>
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
  input: {
    width: '40%',
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 36,
  },
});

export default LoginScreen;