import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Image, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const QRGenerate = () => {
  const navigation = useNavigation();

  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [department, setDepartment] = useState('');
  const [image, setImage] = useState(null);
  const [qrData, setQrData] = useState(null);
  const viewShotRef = useRef(null);

  const pickImage = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.assets) {
        setImage(response.assets[0]);
      }
    });
  };

  const generateQRCode = () => {
    const data = {
      name: studentName,
      class: studentClass,
      department: department,
      image: image ? image.uri : null,
    };
    setQrData(JSON.stringify(data));
  };

  const saveQRCode = async () => {
    // if (Platform.OS === 'android') {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       {
    //         title: 'Storage Permission Required',
    //         message: 'This app needs access to your storage to save QR codes',
    //         buttonNeutral: 'Ask Me Later',
    //         buttonNegative: 'Cancel',
    //         buttonPositive: 'OK',
    //       },
    //     );
  
    //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //       Alert.alert('Permission Denied!', 'You need to give storage permission to save the file');
    //       return;
    //     }
    //   } catch (err) {
    //     console.warn(err);
    //     return;
    //   }
    // }
  
    viewShotRef.current.capture().then(uri => {
      const path = `${RNFS.DownloadDirectoryPath}/qr_code.png`;
      RNFS.moveFile(uri, path)
        .then(() => {
          // Alert.alert('QR Code saved', `QR Code saved to ${path}`);
          Alert.alert(
            'QR Code saved',
            `QR Code saved to ${path}`,
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Home'), // Replace 'NextScreen' with your target screen name
              },
            ],
            { cancelable: false }
          );
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to save QR Code');
          console.error('Error saving QR Code', error);
        });
    });
  };


  return (
    <View style={styles.container}>
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
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Generate QR Code" onPress={generateQRCode} />
      {qrData && (
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
          <View style={styles.qrContainer}>
            <QRCode value={qrData} size={200} />
          </View>
        </ViewShot>
      )}
      {qrData && <Button title="Save QR Code" onPress={saveQRCode} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default QRGenerate;