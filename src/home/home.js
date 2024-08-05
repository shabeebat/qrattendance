import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const Home = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [id, setId] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const permission = await QRCodeScanner.requestPermissions();
      setHasPermission(permission.granted);
    };
    getPermission();
  }, []);

  const handleScan = ({ data }) => {
    const currentTime = new Date();
    let hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    if (hour === 0) {
      hour = 12;
    }
    const punchInTime = `${hour}:${minutes.toString().padStart(2, '0')}${ampm}`;    
    
    setScanned(true);
    setId(data);
    setAttendance([...attendance, { id: data, date: punchInTime, present: true }]);
    handleCloseCamera();
  };

  const handlePresentAttendance = () => {
    setCameraVisible(true);
  };

  const handleCloseCamera = () => {
    setCameraVisible(false);
  };

  return (
    <View>
      <View style={{height: 70, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>Home</Text>
            <TouchableOpacity style={{}} onPress={handlePresentAttendance}>
            <Icon name="camera" size={30} />
            {/* <Text>Scan to mark attendance</Text> */}
        </TouchableOpacity>
      </View>
      <View style={{paddingTop: 20, paddingHorizontal: 15}}>
        <Text style={{fontSize: 16, fontWeight: '700', paddingBottom: 10}}>Attendance List</Text>
        <FlatList
            data={attendance}
            renderItem={({ item }) => (
            <View style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                padding: 10,
                backgroundColor: '#fff'
              }}>
                <Text>ID: {item.id}</Text>
                <Text>Time: {item.date}</Text>
                <Text>Present: {item.present? 'Yes' : 'No'}</Text>
            </View>
            )}
            keyExtractor={(item) => item.id}
        />
      </View>

      <Modal visible={cameraVisible} animationType="slide">
        <QRCodeScanner
          onRead={handleScan}
          flashMode={RNCamera.Constants.FlashMode.auto}
          topContent={
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
              Scan the QR code
            </Text>
          }
          bottomContent={
            <TouchableOpacity onPress={handleCloseCamera}>
              <Text>Close camera</Text>
            </TouchableOpacity>
          }
        />
      </Modal>
    </View>
  );
};

export default Home;