import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from "./firebaseConfig"; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useRevenueCat } from './revenueCatProvider';
import { PurchasesPackage } from 'react-native-purchases';
import User from './revenueCatUser';

const SubscriptionsScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const { user, packages, purchasePackage, restorePermissions } = useRevenueCat(); 


    const signUp = async () =>{
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
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
    <View style={styles.container}>

      <ScrollView>
        {/* Display the packages */}
        <View style={styles.container}>
          {packages.map((pack) => (
            <TouchableOpacity
              key={pack.identifier}
              onPress={() => onPurchase(pack)}
              style={styles.button}
            >
              <View style={styles.text}>
                <Text>{pack.product.title}</Text>
                <Text style={styles.desc}>{pack.product.description}</Text>
              </View>
              <View style={styles.price}>
                <Text>{pack.product.priceString}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Display the user state */}
        <User user={user} />

        <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { alignItems : 'center'}]} onPress={() => FIREBASE_AUTH.signOut()}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
      </ScrollView>
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

export default SubscriptionsScreen;