import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { FIREBASE_AUTH } from './firebaseConfig';
import { setEndpoint } from './flaskEndpoint';

const NotebookScreen = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const { id } = route.params;
  const { name } = route.params;
  const { titleCallback } = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState(name);
  const [summary, setSummary] = useState('');

  const navigation = useNavigation();

  // get data from flask
  const getFlask = () => {
    const uid = encodeURIComponent(FIREBASE_AUTH.currentUser.uid);
    const notebook = encodeURIComponent(name);
    return fetch(setEndpoint + `/get?uid=${uid}&notebook=${notebook}`, {
      method: "GET",
      headers: { 
        'Content-Type': "application/json"
      }
    })
    .then(resp => resp.json())
    .then(data => {
      setNotes(data);
    })
    .catch(error => console.log(error));
  }


  // add data to flask
  const postFlask = (fileData) => {

    return fetch(setEndpoint + '/post', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid,
        title: fileData.title,
        content: fileData.text,
        notebook: name,
        base64String: fileData.base64String
      })
    })
    .then(resp => resp.json())
    .catch(error => console.log(error))
  }


  // update data to flask
  const updateFlask = (fileData) => {

    return fetch(setEndpoint + '/update', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid,
        id: fileData.id,
        title: fileData.title,
        content: fileData.text,
        notebook: name,
        base64String: fileData.base64String
      })
    })
    .then(resp => resp.json())
    .catch(error => console.log(error))
  }


  // delete data from flask
  const deleteFlask = (fileData) => {
    uid = encodeURIComponent(FIREBASE_AUTH.currentUser.uid);
    notebook = encodeURIComponent(name);
    note_id = encodeURIComponent(fileData.id);
    return fetch(setEndpoint + `/delete?uid=${uid}&notebook=${notebook}&id=${note_id}`, {
      method: "DELETE",
      headers: {
        'Content-Type':"application/json"
      },
    })
    .catch(error => console.log(error));
  }


  // update notebook name on flask
  const updateNotebook = () => {

    return fetch(setEndpoint + '/update-notebook', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid,
        notebook_id: id,
        notebook: text,
      })
    })
    .then(resp => resp.json())
    .catch(error => console.log(error))
  }


  // update notebook name on flask
  const summarizeNotebook = () => {

    return fetch(setEndpoint + '/summarize', {
      method: "POST",
      headers: {
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        uid: FIREBASE_AUTH.currentUser.uid,
        notebook_id: id,
        note: null,
        note_id: null
      })
    })
    .then(resp => resp.json())
    .then(data => {
      setSummary(data.result);
    })
    .catch(error => console.log(error))
  }

  // initialize the page with existing txt files
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      await getFlask();

      // Set loading to false once all operations are completed
      setIsLoading(false);
    };

    fetchData();
  }, []);


  // Callback function for drawing screen to pass note object back to notebook
  const callback = async (childData, isNew) => {

    // check same titled note doesn't already exist
    if (isNew && notes.some(note => note.title === childData.title)) {
      alert('A note with the same title already exists!');
      return;
    }

    // POST
    if (isNew) {
      try {
        await postFlask(childData);
        await getFlask();
      } catch (error) {
        console.error("An error occurred:", error);
      }

    // UPDATE
    } else {
      try {
        await updateFlask(childData);
        await getFlask();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

  }


  // Delete note from notebook
  const deleteNote = async (inputContent) => {
    if (inputContent != null) {
      try {
        await deleteFlask(inputContent.inputContent);
        await getFlask();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  // Navigate to drawing screen where we can write some notes
  const draw = ({ currentId, currentText, currentTitle, currentBase64String }) => {
    navigation.navigate('Drawing', { callback, currentId, currentText, currentTitle, currentBase64String })
  }


  const displayDeletePopup = (inputContent) => {
    setIsDeleteVisible(true);
    setNoteToDelete(inputContent);
  }

  const displaySummaryPopup = () => {

    setIsSummaryLoading(true);
    const fetchData = async () => {
      setIsSummaryVisible(true);
      await summarizeNotebook();

      // Set loading to false once all operations are completed
      setIsSummaryLoading(false);
    };
    fetchData();
  }

  const renderNotes = () => {
    return notes.map((note) => (
      <View key={note.title} style={styles.rowContainer}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => draw({currentId : note.id, currentText : note.content, currentTitle : note.title, currentBase64String : note.base64String })} style={styles.buttonNotes}>
            <Text style={styles.buttonText}>{note.title}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => displayDeletePopup({inputContent : note})} style={[styles.buttonNotes, {backgroundColor : '#C7C7C7', flex : 1, marginRight : 0 }]}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    
    ));
  };

  const handleSubmit = (inputContent) => {
    // onPress={() => deleteNote({inputContent : note})}
    deleteNote(inputContent)
    setIsDeleteVisible(false);
  }
  
  const handleCancel = () => {
    setIsDeleteVisible(false);
  }

  const handleSummaryCancel = () => {
    setIsSummaryVisible(false);
    setSummary('');
  }

  const setModalandUpdate = async () => {
    setModalVisible(false);
    await updateNotebook();
    await titleCallback();
  }

  const keyExtractor = (item, index) => item.title;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.title}>{text}</Text>
      </TouchableOpacity>
      {/* Start writing notes */}

      <View style={[styles.buttonContainer, {marginBottom : 10}]}>
        <TouchableOpacity onPress={() => draw({currentText : '', currentTitle : '', currentBase64String : null})} style={styles.button}>
          <Text style={styles.buttonText}>Create Note</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={displaySummaryPopup} style={[styles.button, {backgroundColor: '#C7C7C7'}]}>
          <Text style={styles.buttonText}>Summarize</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Text Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.popup}>
          <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
                value={text}
                onChangeText={setText}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={setModalandUpdate}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : renderNotes()}
      </ScrollView>
      <Text>Number of notes: {notes.length}</Text>

      {/* Popup when deleting note */}
      <Modal visible={isDeleteVisible} transparent={true} supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.popup}>
          <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.popupText}>Are you sure you want to delete this note?</Text>
            <TouchableOpacity style={[styles.addButton, { width: '50%' } ]} onPress={() => handleSubmit(noteToDelete)}>
              <Text style={styles.addButtonLabel}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={handleCancel}>
              <Text style={styles.addButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Popup when summarizing notebook */}
      <Modal visible={isSummaryVisible} transparent={true} supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.popup}>
          <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            
            <Text style={styles.popupText}>Summary:</Text>

            <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
              {isSummaryLoading ? (
                <Text>Loading...</Text>
              ) : <Text style={styles.popupText}>{summary}</Text>}
            </ScrollView>

            <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={handleSummaryCancel}>
              <Text style={styles.addButtonLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  button: {
    backgroundColor: '#92D7FF', // Set the background color to blue
    padding: 10,
    marginTop: 10,
    marginRight: 16,
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
    borderRadius: 5,
  },
  buttonNotes: {
    flex: 6, // This makes button take up more space
    backgroundColor: '#4D4D4D', // Optional: Customize the button's appearance
    paddingVertical: 12, // Optional: To add vertical padding
    //paddingHorizontal: 16, // Optional: To add padding on the sides
    marginTop: 8,
    marginRight: 16,
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', // Set the text color to white
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Optional: To add padding on the sides
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  // for popup
  addButton: {
    backgroundColor: '#88F57C',
    padding: 10,
    marginTop: 20,
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
    borderRadius: 5,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 36,
  },
  popup: {
    backgroundColor: '#000000aa',
    flex: 1,
    // marginTop: 50,
  },
  popupText: {
    fontSize: 36,
  },
  input: {
    borderWidth: 2,        // Width of the outline
    borderColor: 'black',  // Color of the outline (black in this case)
    width: '50%',
    padding: 20,
    fontSize: 36,
    borderRadius: 5,
  },  
});

export default NotebookScreen;