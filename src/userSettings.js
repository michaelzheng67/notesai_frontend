import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import { FIREBASE_APP, FIREBASE_AUTH } from './firebaseConfig';
import { EmailAuthProvider, deleteUser, reauthenticateWithCredential } from 'firebase/auth';


const UserSettingsScreen = ({ navigation }) => {
    const [isDropdownVisible, setDropdownVisible] = React.useState(false);
    const [deleteAccountPopup, setDeleteAccountPopup] = React.useState(false);
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const auth = FIREBASE_AUTH;
    const inputRef_1 = useRef(null);
    const inputRef_2 = useRef(null);

    const handleDropdownPress = () => {
      setDropdownVisible(!isDropdownVisible);
    };

    const handleDropdownPressDeleteAccount = () => {
      setDeleteAccountPopup(!deleteAccountPopup);
    };

    const handleEmailInputChange = (inputText) => {
      setInputEmail(inputText);
    };

    const handlePasswordInputChange = (inputText) => {
      setInputPassword(inputText);
    };

    
    const deleteAccount = () => {
      var credential = EmailAuthProvider.credential(
        inputEmail, // user's email
        inputPassword // user's password
      );

      var currentUser = auth.currentUser;
      var currentEmail = currentUser.email;

      if (inputEmail == currentEmail) {
        reauthenticateWithCredential(currentUser, credential)
        .then(function() {
            // User re-authenticated, now you can proceed with deleting the account
            currentUser.delete();
        });
      }
    }


    return (
        <View style={styles.container}>
            <Text style={{fontSize: 50, textAlign: 'left', marginBottom: 20}}>User Settings</Text>
            
            

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { alignItems : 'center'}]} onPress={handleDropdownPress}>
                    <Text style={styles.buttonText}>Help</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { alignItems : 'center', color : 'red'}]} onPress={handleDropdownPressDeleteAccount}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { alignItems : 'center'}]} onPress={() => FIREBASE_AUTH.signOut()}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            {/* Help popup */}
            <Modal visible={isDropdownVisible} transparent={true} supportedOrientations={['portrait', 'landscape']}>
              <View style={styles.popup}>
                <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[styles.output, {fontWeight: '700'}]}>Notes.Ai is a note-taking tool that uses AI to super-charge your experience</Text>
                  <Text style={styles.output}>Create notebooks that contain notes about information that you want your chatbot to use. 
                        It can then help you answer questions specific to the info that you wrote down.</Text>
                  <Text style={styles.output}>Navigate to the "query" screen to ask your chatbot questions.
                        For more advanced users, you can adjust the settings on your chatbot to give you a more fine-tuned response.</Text>

                  <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={() => setDropdownVisible(false)}>
                    <Text style={styles.addButtonLabel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Delete Account popup */}
            <Modal visible={deleteAccountPopup} transparent={true} supportedOrientations={['portrait', 'landscape']}>
              <View style={styles.popup}>
                <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>

                  <TextInput
                    ref={inputRef_1}
                    style={[styles.input, {marginBottom : 10}]}
                    value={inputEmail}
                    onChangeText={handleEmailInputChange}
                    placeholder="enter email"
                    placeholderTextColor='grey'
                    autoCapitalize='none'
                    autoFocus // This prop might help in keeping the focus
                  />

                  <TextInput
                    ref={inputRef_2}
                    style={styles.input}
                    value={inputPassword}
                    onChangeText={handlePasswordInputChange}
                    secureTextEntry={true}
                    placeholder="enter password"
                    placeholderTextColor='grey'
                    autoFocus // This prop might help in keeping the focus
                  />
                  <TouchableOpacity style={[styles.addButton, { backgroundColor: 'red', width: '50%' }]} onPress={deleteAccount}>
                    <Text style={styles.addButtonLabel}>Delete Account</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={() => setDeleteAccountPopup(false)}>
                    <Text style={styles.addButtonLabel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white'
    },
    input: {
      borderWidth: 2,        // Width of the outline
      borderColor: 'black',  // Color of the outline (black in this case)
      width: '50%',
      padding: 20,
      fontSize: 36,
      borderRadius: 5,
    },  
    dropdownTab: {
      width: '100%',
      height: 40,
      borderColor: 'black',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderRadius: 5,
    },
    dropdownTabText: {
      fontSize: 16,
    },
    dropdownOptions: {
      backgroundColor: '#ffffff',
      position: 'absolute',
      top: 80,
      left: 20,
      width: '100%',
      borderRadius: 5,
      elevation: 5,
    },
    optionItem: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
    },
    outputContainer: {
      marginTop: 20,
      marginBottom: 20,
      borderColor: 'black',
      borderWidth: 2,
      padding: 10,
      width: '100%',
      height: 100,
      borderRadius: 5,

    },
    output: {
      marginBottom: 30,
      marginLeft: 60,
      marginRight: 60,
      fontSize: 30,
  },
    button: {
        backgroundColor: '#4D4D4D',
        padding: 15,
        flex: 7,
        borderWidth: 2,        // Width of the outline
        borderColor: 'black',  // Color of the outline (black in this case)
        marginRight: 10,
        borderRadius: 5,
    },
    buttonContainer: {
      width: '30%', 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // marginBottom: 5, // Add margin between the button containers
      marginright: 5,
      height: 100
    },
    buttonText: {
      color: 'white', // Set the text color to white
      fontSize: 36,
      fontWeight: 'bold',
      textAlign: 'center',
    },

    // for popup elements

    popup: {
      backgroundColor: '#000000aa',
      flex: 1,
      // marginTop: 50,
    },
    addButton: {
      backgroundColor: '#C7C7C7',
      padding: 10,
      marginTop: 20,
      borderWidth: 2,        // Width of the outline
      borderColor: 'black',  // Color of the outline (black in this case)
      borderRadius: 5,
      alignItems: 'center'
    },
    addButtonLabel: {
      color: 'white',
      fontSize: 36,
    },
    
    
});

export default UserSettingsScreen;