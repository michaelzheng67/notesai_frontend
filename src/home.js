/**
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { FIREBASE_AUTH } from './firebaseConfig';
import { setEndpoint } from './flaskEndpoint';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useRevenueCat } from './revenueCatProvider';

function Section({ children, title }) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // State variables
  const [buttons, setButtons] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);
  const { user } = useRevenueCat();

  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const registerUser = () => {
    return fetch(setEndpoint + '/register-user', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid
      })
    })
    .then(resp => resp.json())
    .catch(error => console.log(error))
  }

  const createChroma = () => {
    return fetch(setEndpoint + '/create-chroma', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid
      })
    })
    .then(resp => resp.json())
    .catch(error => console.log(error))
  }

  // get data from flask
  const getNotebooks = () => {
    return fetch(setEndpoint + `/get-notebooks/${FIREBASE_AUTH.currentUser.uid}`, {
      method: "GET",
      headers: { 
        'Content-Type': "application/json"
      }
    })
    .then(resp => resp.json())
    .then(data => {
      setButtons(data);
    })
    .catch(error => console.log(error));
  }


  // add data to flask
  const postNotebook = (inputText) => {
    return fetch(setEndpoint + '/post-notebook', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid,
        notebook: inputText
      })
    })
    .then(resp => resp.json())
    .catch(error => console.log(error))
  }


  // delete data from flask
  const deleteNotebook = (inputText) => {
    uid = encodeURIComponent(FIREBASE_AUTH.currentUser.uid);
    notebook = encodeURIComponent(inputText);
    return fetch(setEndpoint + `/delete-notebook?uid=${uid}&notebook=${notebook}`, {
      method: "DELETE",
      headers: {
        'Content-Type':"application/json"
      },
    })
    .catch(error => console.log(error));
  }



  // Call the function to get subdirectories when the component mounts
  useEffect(() => {
    // Set loading to true at the start
    setIsLoading(true);

    const fetchData = async () => {
        // Assuming registerUser, createChroma, and getNotebooks are async functions
        await registerUser();
        await createChroma();
        await getNotebooks();

        // Set loading to false once all operations are completed
        setIsLoading(false);
    };

    fetchData();
    
  }, [user]);

  
  // Delete button from view
  const deleteButton = async (inputButton) => {

    await deleteNotebook(inputButton.label);
    await getNotebooks();
  };


  const displayDeletePopup = (inputContent) => {
    setIsDeleteVisible(true);
    setNoteToDelete(inputContent);
  }

  const callback = async () => {
    await getNotebooks();
  }


  // Show current buttons
  const renderButtons = () => {
    return buttons.map((button) => (
      <View key={button.label} style={styles.rowContainer}>
        <View style={[styles.buttonContainer, {height : 85}]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Notebook', { titleCallback: callback, id: button.id, name: button.label })}
          >
            <Text style={styles.buttonText}>{button.label}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => displayDeletePopup(button)}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  // Navigate to query screen where we ask about our dataset
  const query = (navigation) => {
    navigation.navigate('Query', { buttons: buttons });
  };

  // Navigate to user settings screen
  const userSettings = (navigation) => {
    navigation.navigate('UserSettings');
  }


  const handleSubmit = async () => {
    setIsModalVisible(false);
    setInputText('');

    // check that ID doesn't currently exist in button list
    if (buttons.some(button => button.label === inputText)) {
      alert('An item with the same key already exists!');
      return;
    }

    await postNotebook(inputText);
    await getNotebooks();

  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputText('');
  }


  const handleDeleteSubmit = async (inputContent) => {
    // onPress={() => deleteNote({inputContent : note})}
    await deleteNotebook(inputContent.label);
    await getNotebooks();
    setIsDeleteVisible(false);
  }
  
  const handleDeleteCancel = () => {
    setIsDeleteVisible(false);
  }


  const handleTextInputChange = (inputText) => {
    setInputText(inputText);
  };


  // Actual view that is returned
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      <View style={styles.buttonContainer}>
        <Text style={{fontSize: 60, textAlign: 'center', marginRight: 10, marginBottom: 10, flex: 7, padding: 15}}>My Notebooks</Text>
        {/* Sign out button TEMPORARILY HERE */}
        <TouchableOpacity style={[styles.deleteButton, { alignItems : 'center'}]} onPress={() => userSettings(navigation)}>
          {/* <Text style={[styles.deleteButtonText, ]}>X</Text> */}
          <Image
            source={require('../img/gear-icon.png')}
            style={{ width : 60, height : 60 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
        {/* Display current buttons */}

        {isLoading ? (
            <Text>Loading...</Text>
        ) : renderButtons()}
        
        
      </ScrollView>

      
      
      {/* Popup when adding new button */}
      <Modal visible={isModalVisible} transparent={true} supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.popup}>
          <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={handleTextInputChange}
              placeholder="Enter Notebook Name"
              placeholderTextColor='grey'
              autoFocus // This prop might help in keeping the focus
            />
            <TouchableOpacity style={[styles.addButton, { width: '50%' } ]} onPress={handleSubmit}>
              <Text style={styles.addButtonLabel}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={handleCancel}>
              <Text style={styles.addButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Popup when deleting note */}
      <Modal visible={isDeleteVisible} transparent={true} supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.popup}>
          <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.popupText}>Are you sure you want to delete this notebook?</Text>
            <TouchableOpacity style={[styles.addButton, { width: '50%' } ]} onPress={() => handleDeleteSubmit(noteToDelete)}>
              <Text style={styles.addButtonLabel}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={handleDeleteCancel}>
              <Text style={styles.addButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <View style={styles.buttonContainer}>
        {/* Add button */}
        <TouchableOpacity style={[styles.addButton, { marginRight: 10, flex : 3 }]} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addButtonLabel}>Add Notebook</Text>
        </TouchableOpacity>

        {/* Query button */}
        <TouchableOpacity style={[styles.queryButton, { marginRight: 10, flex : 2 }]} onPress={() => query(navigation)}>
          <Text style={styles.addButtonLabel}>Query</Text>
        </TouchableOpacity>

      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
    width: '50%',
    padding: 20,
    fontSize: 36,
    borderRadius: 5,
  },  


  // Styles for add / delete button section
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 5, // Add margin between the button containers
    marginright: 5,
    height: 100
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
  buttonText: {
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#C7C7C7',
    padding: 15,
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
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
  queryButton: {
    backgroundColor: '#92D7FF',
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



  // for popup
  popup: {
    backgroundColor: '#000000aa',
    flex: 1,
    // marginTop: 50,
  },

  popupText: {
    fontSize: 36,
  }
  
});

export default HomeScreen;
