import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from "./firebaseConfig"; 
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';





const ForgotPasswordScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const auth = FIREBASE_AUTH;


    const resetPassword = async (email) =>{
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('request sent!');
        setEmail('');
      } catch (error) {
        console.log(error);
        console.log("failed send password reset");
      }
    }


    const onPurchase = (pack) => {
      // Purchase the package
      purchasePackage(pack);
    };


    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={{ fontSize : 30, marginBottom : 70 }}>Enter your email and we'll send a password reset request</Text>

        <TextInput style={styles.input} value={email} placeholder='email' placeholderTextColor='grey' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => resetPassword(email)}
        >
          <Text style={styles.buttonText}>Send Email</Text>
        </TouchableOpacity>

        <Text style={{ fontSize : 40, marginBottom : 70 }}>{successMessage}</Text>
      </KeyboardAvoidingView>
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

export default ForgotPasswordScreen;