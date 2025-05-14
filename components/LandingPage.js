import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const LandingPage = ({Navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Landing Page!</Text>
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
});

export default LandingPage;