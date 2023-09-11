import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import { FIREBASE_APP, FIREBASE_AUTH } from './firebaseConfig';
import { setEndpoint } from './flaskEndpoint';


const AdvancedSettingsScreen = ({ navigation }) => {
    const [temperatureValue, setTemperatureValue] = useState(0.2);
    const [similarityValue, setSimilarityValue] = useState(1);
    const [wordcountValue, setWordcountValue] = useState(50);


    // get data from flask
    const getSettings = () => {
      uid = encodeURIComponent(FIREBASE_AUTH.currentUser.uid);
      return fetch(setEndpoint + `/get-settings/${uid}`, {
      method: "GET",
      headers: { 
          'Content-Type': "application/json"
      }
      })
      .then(resp => resp.json())
      .then(data => {
          setTemperatureValue(data.temperature);
          setSimilarityValue(data.similarity);
          setWordcountValue(data.wordcount);
      })
      .catch(error => console.log(error));
    }

    // add data to flask
    const postSettings = () => {
        return fetch(setEndpoint + '/post-settings', {
        method: "POST",
        headers: {
            'Content-Type':"application/json"
        },
        body: JSON.stringify({
          uid: FIREBASE_AUTH.currentUser.uid,
          temperature : temperatureValue,
          similarity : similarityValue,
          wordcount : wordcountValue
        })
        })
        .then(resp => resp.json())
        .catch(error => console.log(error))
    }


    // on page load get settings from environment variables on flask side
    useEffect(() => {
        getSettings();
      }, []);


    saveAndBack = () => {
        postSettings();
        navigation.goBack();
    }


    return (
        <View style={styles.container}>
            <Text style={{fontSize: 50, textAlign: 'left', marginBottom: 20}}>Advanced Settings</Text>
            
            <Text style={{fontSize: 20}}>Temperature - Creativity of answers (0 being least, 1 being most)</Text>
            {/* Toggle temperature */}
            <View style={styles.buttonContainer}>
                <Text>{temperatureValue.toFixed(2)}</Text>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    onValueChange={(value) => setTemperatureValue(value)}
                    value={temperatureValue}
                />
            </View>

            <Text style={{fontSize: 20}}>Similarity Results - How many note results are returned that match query</Text>
            {/* Toggle how many similarity results are returned from ChromaDB */}
            <View style={styles.buttonContainer}>
                <Text>{Math.trunc(similarityValue)}</Text>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={1}
                    maximumValue={10}
                    onValueChange={(value) => setSimilarityValue(value)}
                    value={similarityValue}
                />
            </View>

            <Text style={{fontSize: 20}}>Max Words Returned - Limit on how long response is</Text>
            {/* Toggle how many words or less are returned  */}
            <View style={styles.buttonContainer}>
                <Text>{Math.trunc(wordcountValue)}</Text>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={1}
                    maximumValue={100}
                    onValueChange={(value) => setWordcountValue(value)}
                    value={wordcountValue}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={saveAndBack} style={[styles.button, { flex : 7}]}>
                    <Text style={styles.buttonText}>Save</Text>
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
    //   width: '100%',
      height: 40,
      borderColor: 'black',
      borderWidth: 2,
      marginBottom: 20,
      paddingHorizontal: 10,
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
        marginTop: 20,
        fontSize: 16,
    },
    button: {
      backgroundColor: '#92D7FF', // Set the background color to blue
      padding: 10,
      marginTop: 10,
      marginRight: 16,
      marginLeft: 16,
      borderWidth: 2,        // Width of the outline
      borderColor: 'black',  // Color of the outline (black in this case)
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
    
    
});

export default AdvancedSettingsScreen;