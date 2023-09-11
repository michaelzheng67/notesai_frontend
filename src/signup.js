import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from "./firebaseConfig"; 
import { createUserWithEmailAndPassword } from 'firebase/auth';





const SignupScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;


    const signUp = async () =>{
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        // navigation.navigate("Home");
      } catch (error) {
        console.log(error);
        console.log("failed sign in");
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
        <Text style={styles.title}>Notes.ai Sign Up</Text>

        <TextInput style={styles.input} value={email} placeholder='email' placeholderTextColor='grey' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
        <TextInput style={styles.input} secureTextEntry={true} value={password} placeholder='password' placeholderTextColor='grey' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => signUp()}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
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

export default SignupScreen;