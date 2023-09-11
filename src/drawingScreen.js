import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput, StyleSheet, findNodeHandle, UIManager, ActivityIndicator, NativeModules, KeyboardAvoidingView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CanvasView from './canvasView';
import { SafeAreaView } from 'react-native-safe-area-context';



const DrawingScreen = ({ route }) => {
    
    const { callback }  = route.params;
    const { currentId } = route.params;
    const { currentText } = route.params;
    const { currentTitle } = route.params;
    const { currentBase64String } = route.params;

    const [id, setId] = React.useState(currentId);
    const [text, setText] = React.useState(currentText);
    const [drawing, setDrawing] = React.useState(null);
    const [title, setTitle] = React.useState(currentTitle);
    const [normalMode, setNormalMode] = React.useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const canvasRef = useRef(null);
    const titleRef = useRef(null);

      useEffect(() => {
        if (!normalMode && currentBase64String) {
          let ref_var = findNodeHandle(canvasRef.current);
          if (ref_var) {
            NativeModules.CanvasView.setDrawingFromBase64(ref_var, currentBase64String);
            console.log("loaded existing drawing");
          }
        }
      }, [normalMode, currentBase64String]);


      useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: (props) => (
                <TouchableOpacity 
                    // style={{ marginLeft: 10 }} 
                    onPress={() => {
                        Alert.alert(
                            'Confirm Back',
                            'Are you sure? You might have unsaved changes',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => {},
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => navigation.goBack(),
                                },
                            ],
                            { cancelable: false }
                        );
                    }}
                >
                    <Text style={{ fontSize : 20 }}>Back</Text>  
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    const handleTitleChange = (inputTitle) => {
      setTitle(inputTitle);
    }

    // Change the text associated with the note
    const handleTextChange = (inputText) => {
      setText(inputText);
    };

    const handleDeleteLastWord = () => {
      // Split the text by spaces
      const words = text.trim().split(' ');
  
      // Remove the last word
      words.pop();
  
      // Join the remaining words back together
      const newText = words.join(' ');
  
      // Update the state
      setText(newText);
    };

    // Return back data to the notebook screen and navigate back
    const handleCallback = async () => {

      let base64String = ""
      if (canvasRef.current != null) {
        let ref_var = findNodeHandle(canvasRef.current);
        base64String = await NativeModules.CanvasView.captureDrawing(ref_var);
        console.log("getting string");
      }
      
      data = {
        id : id,
        title : title,
        text : text,
        base64String : base64String
      }

      // if this is a new note, add it to the notebook
      if (currentTitle == '' && currentText == '') {
        callback(data, true);

      // otherwise update its contents
      } else {
        callback(data, false);
      }


      
      goBack();
    }
    
    // Go back to the notebook screen (parent component)
    const goBack = () => {
      navigation.goBack();
    }

    // recognize the text on the drawing screen
    const recognizeText = () => {
      setLoading(true); // Set loading to true when starting recognition
      setText(''); // Clear previous text
      const handle = findNodeHandle(canvasRef.current);
      UIManager.dispatchViewManagerCommand(handle, 'recognizeText', []);
    };
  
    // helper function for text recognition and setting content
    const onRecognizeText = async (event) => {
      setText(event.nativeEvent.recognizedText);
      setLoading(false); // Set loading to false when recognition is finished
    };


    // const captureImage = () => {
    //   const handle = findNodeHandle(canvasRef.current);
    //   CanvasViewManager.captureDrawing(handle).then((base64String) => {
    //     // You now have the image data as a Base64 string and can include it in your fetch request
    //     postFlask({ title: 'My Title', text: text }, base64String);
    //   });
    // };

    const setNormalModeAndSaveImage = async () => {

      setNormalMode(true);
      let ref_var = findNodeHandle(canvasRef.current);
      base64String = await NativeModules.CanvasView.captureDrawing(ref_var);
      setDrawing(base64String);
    }

    const setNormalModeAndSetImage = async () => {

      setNormalMode(false);
      if (drawing != null) {
        setTimeout(async () => {
            if (canvasRef.current) {
                let ref_var = findNodeHandle(canvasRef.current);
                if (ref_var) {
                    NativeModules.CanvasView.setDrawingFromBase64(ref_var, drawing);
                }
            }
        }, 0); // delay (in ms)
    }
    }

  

    return (
        <SafeAreaView style={styles.container}>


            {/* Header */}
          <View style={[styles.inputContainer, {marginTop: 20}]}>

            <View style={{ flexDirection : 'row', marginTop: 10 }}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={handleTitleChange}
                placeholder="Note Title"
                placeholderTextColor='grey'
              /> 


              <TouchableOpacity style={[styles.addButton, {backgroundColor : '#92D7FF'}]} onPress={handleCallback}>
                <Text style={{ fontSize: 25}}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.addButton, {backgroundColor : 'grey'}]} onPress={handleDeleteLastWord}>
                <Text style={{ fontSize: 25}}>Undo Word</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Content body */}
          <View style={styles.displayContainer}>
          
            {/* Content Input */}

            {
              normalMode ? 

              <ScrollView
                  style={styles.input}
                  contentContainerStyle={{ width: '100%', height: '1000%' }} // Adjust this to your desired "infinite" canvas size
                  maximumZoomScale={5}
                  minimumZoomScale={1}
              >
                <TextInput
                  style={[styles.input, { flex : 7, borderColor : "transparent" }]}
                  onChangeText={handleTextChange}
                  value={text}
                  placeholder="Enter text here"
                  placeholderTextColor='grey'
                  multiline={true}
                  textAlignVertical="top"
                />
              </ScrollView>

              :

              <ScrollView
                  style={styles.input}
                  contentContainerStyle={{ width: '100%', height: '1000%' }} // Adjust this to your desired "infinite" canvas size
                  maximumZoomScale={5}
                  minimumZoomScale={1}
              >
                <CanvasView ref={canvasRef} onRecognizeText={onRecognizeText} style={{ flex: 1, height: '100%' }} />
              </ScrollView>

            }

      
          </View>
          
          <View style={[styles.inputContainer,{ alignItems : 'left' }]}>
            <View style={{ flexDirection : 'row', marginTop: 10 }}>
              <TouchableOpacity style={[styles.addButton, {backgroundColor : normalMode === true ? 'lightgray' : 'grey'}]}  onPress={setNormalModeAndSaveImage}>
                <Text style={{ fontSize: 25}}>Normal View</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.addButton, {backgroundColor : normalMode === true ? 'grey' : 'lightgray'}]} onPress={setNormalModeAndSetImage}>
                <Text style={{ fontSize: 25}}>Freestyle</Text>
              </TouchableOpacity>

              {normalMode ? <Text></Text> : <Text>* Work done on freestyle canvas can't be used in query output (yet!)*</Text>}
            </View>
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column', // Make the children side-by-side
      backgroundColor: 'white'
    },
    inputContainer: {
      // flex: 1, // Take half of the available space
      paddingHorizontal: 20,
      alignItems: 'center', // Center the text horizontally
      marginBottom: 20,
    },
    input: {
      flex: 1,
      width: '100%',
      height: 60,
      borderColor: 'black',
      borderWidth: 2,
      paddingHorizontal: 10,
      textAlignVertical: 'top',
      marginRight: 10,
      fontSize: 30,
      borderRadius: 5,
    },
    displayContainer: {
      flex: 1, // Take half of the available space
      paddingHorizontal: 20,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    displayText: {
      fontSize: 20,
    },
    addButton: {
      padding: 10,
      paddingHorizontal: 25,
      marginRight: 10,
      borderWidth: 2,        // Width of the outline
      borderColor: 'black',  // Color of the outline (black in this case)
      justifyContent: 'center',
      borderRadius: 5,
    },
    hiddenStyle: { 
      width: 0, 
      height: 0, 
      overflow: 'hidden' 
    }
});
  
export default DrawingScreen;