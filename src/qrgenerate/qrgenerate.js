import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const StudentQRCode = ({ name, image, class: studentClass, department }) => {
  // Convert image to base64 string
  const imageBase64 = `data:image/png;base64,${image}`;

  const studentInfo = {
    name: 'John Doe',
    image: 'iVBORw0KGg...', // Base64 image string
    class: 'Class 10',
    department: 'Science',
  };


  // Create QR code data
  const qrCodeData = JSON.stringify({
    name,
    image: imageBase64,
    class: studentClass,
    department,
  });

  return (
    <View>
      <QRCode
        value={qrCodeData}
        size={200}
        color="#000"
        backgroundColor="#fff"
      />
      <Text>{name}'s QR Code</Text>
    </View>
  );
};

export default StudentQRCode;

import React from 'react';
import StudentQRCode from './StudentQRCode';

const App = () => {
  const studentInfo = {
    name: 'John Doe',
    image: 'iVBORw0KGg...', // Base64 image string
    class: 'Class 10',
    department: 'Science',
  };

  return (
    <View>
      <StudentQRCode {...studentInfo} />
    </View>
  );
};

export default App;
