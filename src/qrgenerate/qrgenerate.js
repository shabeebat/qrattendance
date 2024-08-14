import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Image, Text, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, Platform, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'react-native-image-picker';
import {captureRef} from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const QRGenerate = () => {
  const navigation = useNavigation();

  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [image, setImage] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [saveFile, setSaveFile] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false); // State for loading indicator

  const viewShotRef = useRef(null);

  const pickImage = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.assets) {
        setImage(response.assets[0]);
        // setFileDetails(response)
      }
    });
  };

  const takeSelfie = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        // cameraType: 'front', // Use the front camera for selfies
      },
      response => {
        if (response.assets) {
          console.log("res======", response);
          setImage(response.assets[0]);
          // setFileDetails(response)
        } else if (response.errorCode) {
          console.error('Camera Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to take photo');
        }
      }
    );
  };

  const generateQRCode = () => {
    setQrData(imageUrl)
    // const data = {
    //   name: studentName,
    //   class: studentClass,
    //   department: department,
    //   image: image ? image.uri : null,
    // };
    // setQrData(JSON.stringify(data));
  };

  const getPermissionAndroid = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Image Download Permission',
                message: 'Your permission is required to save images to your device',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.log('Error while requesting permission: ', err);
        return false;
    }
};

  const saveQRCode = async () => {
        // download image
          try {
              // react-native-view-shot caputures component
              const uri = await captureRef(viewShotRef, {
                  format: 'png',
                  quality: 0.8,
              });
              // console.log("uriiii", uri);
              
  
              if (Platform.OS === 'android') {
                  const granted = await getPermissionAndroid();
                  // if (!granted) {
                  //     alert("Permission needed");
                  // // return;
                  // }
              }
  
              // cameraroll saves image
              const image = CameraRoll.save(uri, 'photo');
              if (image) {
                Alert.alert(
                  '',
                  `QR Code saved`,
                  [
                    {
                      text: 'OK',
                      onPress: () => console.log("ok"), // Replace 'NextScreen' with your target screen name
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                  alert("no QR code")
              }
          } catch (error) {
              console.log('error', error);
          }

  //   if (Platform.OS === 'android' && Platform.Version >= 30) {
  //     // Scoped storage example
  //     try {
  
  //   const hasPermission = await requestStoragePermission();
  //   console.log("hasPermission", hasPermission);
  //   if (!hasPermission) return;
  
  //   viewShotRef.current.capture().then(uri => {
  //     const path = `${RNFS.DownloadDirectoryPath}/qr_code.png`;
  //     RNFS.moveFile(uri, path)
  //       .then(() => {
  //         // Alert.alert('QR Code saved', `QR Code saved to ${path}`);
  //         Alert.alert(
  //           'QR Code saved',
  //           `QR Code saved to ${path}`,
  //           [
  //             {
  //               text: 'OK',
  //               onPress: () => console.log("ok"), // Replace 'NextScreen' with your target screen name
  //             },
  //           ],
  //           { cancelable: false }
  //         );
  //       })
  //       .catch(error => {
  //         Alert.alert('Error', 'Failed to save QR Code');
  //         console.error('Error saving QR Code', error);
  //       });
  //   });
  // } catch (error) {
  //   console.error('Error:', error);
  // }

  };

  const uploadImageToStorage = async () => {
    setLoading(true)
    if (image) {
      const { uri, fileName } = image;
      // const storageRef = storage().ref(`images/${Date.now()}_${fileName}`);
      const storageRef = storage().ref(`images/${fileName}`);
      console.log('Image upload:', storageRef, uri, fileName );

      try {
        // Upload the file to the path 'images/<unique-timestamp>_<filename>'
        await storageRef.putFile(uri);

        // Get the URL of the uploaded image
        const imageUrl = await storageRef.getDownloadURL();
        console.log('Image uploaded to Firebase Storage:', imageUrl);

        // Optionally, you can now use the imageUrl for further processing
        Alert.alert('Success', 'Image uploaded successfully');
        fetchImageUrl();

      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image');
        setLoading(true)

      }
    } else {
      Alert.alert('No image selected', 'Please take a selfie first');
      setLoading(true)

    }
  };

  const fetchImageUrl = async () => {
    try {
      const { uri, fileName } = image;
      const url = await storage().ref(`images/${fileName}`).getDownloadURL();
      console.log("documentSnapshot=======", url);
      setImageUrl(url)
      setSaveFile(true)
      setLoading(true)
    } catch (error) {
      console.error('Error fetching image URL:', error);
    } finally {
      setLoading(false);
    }
  };


  // const uploadImageToStorage = async () => {
  //   if (image) {
  //     const { uri, fileName } = image;
  //     const storageRef = storage().ref(`images/${Date.now()}_${fileName}`);

  //     try {
  //       await storageRef.putFile(uri);
  //       const imageUrl = await storageRef.getDownloadURL();
  //       console.log("UPLOAD=====>", storageRef, imageUrl);
  //       return imageUrl;
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       Alert.alert('Error', 'Failed to upload image');
  //       return null;
  //     }
  //   }
  //   return null;
  // };

  const saveAllData = async () => {
    // setQrData('https://picsum.photos/200/300')
    // const imageUrl = await uploadImageToStorage();
    // if (!imageUrl) return;

    // const data = {
    //   name: studentName,
    //   class: studentClass,
    //   department: department,
    //   image: imageUrl, // Use image URL for the QR code data
    // };
    // setQrData(JSON.stringify(data));

    // Save the data to Firestore
    try {
      await firestore().collection('Users').add(data);
      console.log('User data saved to Firestore');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  }

  const RefreshPage = () => {
    setQrData(null)
    setImage(null)
    setImageUrl(null)
    setSaveFile(false)
    setStudentName('');
    setStudentClass('');
    setDepartment('');
    setRollNo('');
  }

  return (
    <View style={{flex: 1}}>
        <View style={{height: 70, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>ID GENERATION</Text>
            <TouchableOpacity style={{}} onPress={RefreshPage}>
              <Text>Refresh</Text>
          </TouchableOpacity>      
        </View>
      <View style={styles.container}>
      {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
    <ScrollView showsVerticalScrollIndicator={false}>
      <TextInput
        style={styles.input}
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
      />
      <TextInput
        style={styles.input}
        placeholder="Class"
        value={studentClass}
        onChangeText={setStudentClass}
      />
      <TextInput
        style={styles.input}
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
      />
      <TextInput
        style={styles.input}
        placeholder="Roll number"
        value={rollNo}
        onChangeText={setRollNo}
      />
      {/* <Button title="Pick Image" onPress={pickImage} /> */}
      <TouchableOpacity style={styles.buttonStyle} onPress={takeSelfie}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <TouchableOpacity style={styles.buttonStyle} onPress={() => saveFile? generateQRCode(): uploadImageToStorage()}>
        <Text style={styles.buttonText}>{saveFile?  'Generate QR Code' : 'Save File'}</Text>
      </TouchableOpacity>
      {qrData && (
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
          <View style={styles.qrContainer}>
            <QRCode value={qrData} size={200} />
          </View>
        </ViewShot>
      )}
      {qrData && 
      <TouchableOpacity style={styles.buttonStyle} onPress={saveQRCode}>
        <Text style={styles.buttonText}>Save QR Code</Text>
      </TouchableOpacity>}
    </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 8,
  },
  qrContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  buttonStyle: {
    marginVertical: 10,
    backgroundColor: 'blue', 
    width: '100%', 
    height: 40, 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  }
});

export default QRGenerate;