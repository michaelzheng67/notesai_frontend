import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import RNFS from 'react-native-fs';
import { FIREBASE_AUTH } from './firebaseConfig';
import { setEndpoint } from './flaskEndpoint';


const QueryScreen = ({ navigation, route }) => {
    const [outputText, setOutputText] = useState('Note: May have to reload app for chatbot to use new notes');
    const [historyText, setHistoryText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputText, setInputText] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [isDropdownVisible, setDropdownVisible] = React.useState(false);
    const scrollViewRef = useRef();

    const { buttons } = route.params;
    const options = ['All', ...buttons.map((button) => button.label)];

    const appendText = (newText) => {
      setOutputText((prevText) => prevText + "\n------\n" + newText);
    }

    const appendHistoryText = (newText) => {
      setHistoryText((prevText) => prevText + "\n" + newText);
    }

    // get data from flask
    const queryFlask = () => {
      return fetch(setEndpoint + `/query`, {
        method: "POST",
        headers: { 
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          uid: FIREBASE_AUTH.currentUser.uid,
          history: historyText,
          query_string: inputText,
          notebook: selectedOption
        })
      })
      .then(resp => resp.json())
      .then(data => {

        // add notebook filter and output text
        if (selectedOption == null) {
          appendText( "\n" + "Notebook: All" + "\n\n" + "Question: " + inputText + "\n" + "Answer: " + data.result.trim() + "\n");
        } else{
          appendText("\n" + "Notebook: " + selectedOption.trim() + "\n\n" + "Question: " + inputText + "\n" + "Answer: " + data.result.trim() + "\n");
        }
        appendHistoryText("Human: " + inputText + "\n" + "AI: " + data.result.trim());
        //appendText(data.result);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
    }



    const handleTextInputChange = (inputText) => {
        setInputText(inputText);
    };
    
    const handleDropdownPress = () => {
        setDropdownVisible(!isDropdownVisible);
    };
    
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setDropdownVisible(false);
    };

    
    const handleSubmit = async () => {
        // Handle the form submission here
        // make sure user actually asked a question
        if (inputText == '') {
          appendText("You didn't enter a question");
        } else {
          setIsLoading(true);
          await queryFlask();
        }
        setInputText('');
    };


    return (
        <View style={styles.container}>
            
            {/* Text Input */}
            <TextInput
                style={[styles.input, {marginTop : 30}]}
                onChangeText={handleTextInputChange}
                value={inputText}
                placeholder="Enter query here"
                placeholderTextColor='grey'
            />

            {/* Dropdown Tab */}
            <TouchableOpacity onPress={handleDropdownPress} style={styles.dropdownTab}>
                <Text style={styles.dropdownTabText}>{selectedOption || 'Specify Notebook (Optional)'}</Text>
            </TouchableOpacity>

            {/* Text Output */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.outputContainer}
              onContentSizeChange={(e) => {
                  scrollViewRef.current.scrollToEnd({ animated: true });
              }}
            >
            
              {isLoading ? <Text style={styles.output}>Loading...</Text> : (outputText && <Text style={styles.output}>{outputText}</Text>)}
            </ScrollView>


            {/* Notebook select popup */}
            <Modal visible={isDropdownVisible} transparent={true} supportedOrientations={['portrait', 'landscape']}>
              <View style={styles.popup}>
                <View style={{backgroundColor : 'white', flex: 1, margin : 50, padding: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>

                  <FlatList
                    style={{ width : '100%' }}
                    data={options}
                    renderItem={({ item }) => (
                        <TouchableOpacity key={item} onPress={() => handleOptionSelect(item)} style={[styles.addButton,{ backgroundColor : 'lightgrey', width : '100%'}]}>
                        <Text style={{fontSize : 24}}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.label}
                  />

                  <TouchableOpacity style={[styles.addButton, { backgroundColor: '#C7C7C7', width: '50%' }]} onPress={() => setDropdownVisible(false)}>
                    <Text style={styles.addButtonLabel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
  
            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit} style={[styles.button, { flex : 7, marginRight: 10}]}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity  onPress={() => navigation.navigate('AdvancedSettings')} style={[styles.button, { backgroundColor : '#C7C7C7'}]}>
                <Text style={styles.buttonText}>Advanced Settings</Text>
              </TouchableOpacity>
            </View>
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
      width: '100%',
      borderColor: 'black',
      borderWidth: 2,
      marginBottom: 20,
      padding: 10,
      borderRadius: 5,
      fontSize: 25
    },
    dropdownTab: {
      width: '100%',
      height: 40,
      borderColor: 'black',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      // marginBottom: 20,
      borderRadius: 5,
    },
    dropdownTabText: {
      fontSize: 25,
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
      flex: 1,
      marginTop: 20,
      marginBottom: 5,
      borderColor: 'black',
      borderWidth: 2,
      // padding: 10,
      paddingLeft: 10,
      paddingRight: 10,
      width: '100%',
      height: 100,
      borderRadius: 5,
      fontSize: 25
    },
    output: {
        // marginTop: 20,
        fontSize: 25,
    },
    button: {
      backgroundColor: '#92D7FF', // Set the background color to blue
      padding: 10,
      marginTop: 10,
      // marginRight: 16,
      // marginLeft: 16,
      borderWidth: 2,        // Width of the outline
      borderColor: 'black',  // Color of the outline (black in this case)
      borderRadius: 5,
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
    buttonText: {
      color: 'white', // Set the text color to white
      fontSize: 36,
      textAlign: 'center',
    },

    // for popup elements

    popup: {
      backgroundColor: '#000000aa',
      flex: 1,
      // marginTop: 50,
    },
    addButton: {
      backgroundColor: '#88F57C',
      padding: 10,
      marginTop: 20,
      borderWidth: 2,        // Width of the outline
      borderColor: 'black',  // Color of the outline (black in this case)
      borderRadius: 5,
    },
    
    
});

export default QueryScreen;