import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SHA256 from 'crypto-js/sha256';
import Icon from 'react-native-vector-icons/Feather';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ImageBackground} from 'react-native';
import TypingText from './TypingText';
import useRequiredField from './RequiredTextInput';

const Signin = ({navigation}) =>{
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const phoneNumberField = useRequiredField(text => /^\d+$/.test(text));
  const passwordField = useRequiredField(text => text.trim() !== '');

  const handleSignUpRedirect = () => {
    // Navigate to the SignUp page
    navigation.navigate('Signup');
  };

  const handleSignin = async () => {
    const hashedPhoneNumber = SHA256(phoneNumber).toString();
    const hashedInputPassword = SHA256(password).toString();
    
    phoneNumberField.validate(phoneNumber);
    passwordField.validate(password);
  
    if (!phoneNumberField || !passwordField) {
      alert("Please fill all fields correctly.");
      return;
    }
  
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (!storedUserData) {
        Alert.alert('Error', 'No user data found. Please sign up first.');
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      const storedPhoneHash = parsedUserData.phoneNumberHash;
      const storedPasswordHash = parsedUserData.password;
      // Check if the user data exists
      if (storedPhoneHash === hashedPhoneNumber && storedPasswordHash === hashedInputPassword) {
        alert('Login successful!');
        navigation.navigate('LandingPage', {
          phoneNumber: hashedPhoneNumber,
          password: hashedInputPassword
        });
      } else {
        alert('Invalid phone number or password.');
      }
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      alert('An error occurred while signing in.');
    }
  };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
                    <ImageBackground
                        source={require('../images/bg-1.jpeg')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    >
                        
                        <TypingText text={["Welcome", "Back"]}/>
                    </ImageBackground>
                </View>
                <View style={styles.formContainer}>
        <Text style={styles.label}>Sign in</Text>

          <TextInput
            style={styles.input}
            placeholder="+923456789765"
            value={phoneNumber}
            onChangeText={(text) => {
                // Ensure it always starts with "+63"
                if (!text.startsWith('+63')) {
                  text = '+63' + text.replace(/[^0-9]/g, ''); // Remove non-numeric and re-append
                }

                // Limit to 13 characters total
                if (text.length <= 13) {
                  setPhoneNumber(text);
                }
            }}
            placeholderTextColor="#aaa"
            keyboardType='phone-pad'
            maxLength={13}
          />

        <View style={styles.passwordInput}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
            secureTextEntry = {!passwordVisible}
            maxLength={20}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignin}>
          <Icon name="arrow-right" size={32} color="#fff"/>
        </TouchableOpacity>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignUpRedirect}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a40000",
    paddingTop: 50
  },
  header: {
    flex: 1,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  headerImage: {
    width: '100%',
    height: 700,
    alignItems: 'flex-end',
    paddingTop: 100,
  },
    formContainer: {
        flex: .8,
        backgroundColor: 'white',
        marginTop: -80,
        borderRadius: 40,
        padding: 50,
        elevation: 10,
      },
      label: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
      },
      input: {
        height: 50,
        borderColor: '#898989',
        borderBottomWidth: 1,
        marginBottom: 15,
        fontSize: 16,
      },
      signInButton: {
        position: 'absolute',
        top: -40,
        right: 60,
        backgroundColor: '#f44336',
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
      },
      passwordInput: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#898989',
        borderBottomWidth: 1,
        marginBottom: 15,
      },
      links: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 30,
        paddingHorizontal: 10
      },
      forgotText: {
        color: '#f44336',
        fontWeight: 500
      },
      linkText: {
        fontWeight: 900
      }
});

export default Signin;