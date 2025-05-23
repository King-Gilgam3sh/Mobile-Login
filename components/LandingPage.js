import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

const LandingPage = ({navigation, route}) => {
  const { phoneNumber, password } = route.params || {};

  const handleGenerate = () => {
    // Simple Alert popup
    Alert.alert(
      'Your Credentials',
      `Phone Number: ${phoneNumber}\n\nPassword: ${password}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Landing Page!</Text>
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LandingPage;