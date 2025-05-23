import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SHA256 from 'crypto-js/sha256';
import Icon from 'react-native-vector-icons/Feather';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ImageBackground, Alert} from 'react-native';
import TypingText from './TypingText';
import useRequiredField from './RequiredTextInput';


const Signup = ({navigation}) =>{
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    //Validators
    const nameField = useRequiredField(text => /^[A-Za-z\s'-]+$/.test(text.trim()));    
    const phoneNumberField = useRequiredField(text => /^\d+$/.test(text));
    const emailField = useRequiredField(text => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim()));    
    const passwordField = useRequiredField(text => text.trim() !== '');
    const confirmPasswordField = useRequiredField(text => text.trim() !== '');

    const handleSignup = async () => {
      nameField.validate(fullName);
      phoneNumberField.validate(phoneNumber);
      emailField.validate(email);
      passwordField.validate(password);
      confirmPasswordField.validate(confirmPassword);
      // Basic validation
      if (
        !nameField ||
        !phoneNumberField ||
        !emailField ||
        !passwordField ||
        !confirmPasswordField
      ){
        alert("Please fill all fields correctly.");
        return;
      }else if(password.length < 8) {
        alert("Password must be at least 8 characters long."); 
        return;
      }else if (password !== confirmPassword) {
        alert("Passwords do not match."); 
        return;
      }else if (emailField.error) {
        alert("Invalid email format."); 
        return;
      }
  
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const existing = JSON.parse(storedData);
          const hashedPhone = SHA256(phoneNumber).toString();
          // check duplicates
          if (existing.email === email || existing.phoneNumberHash === hashedPhone) {
            Alert.alert('Error', 'Email or phone number already exists.');
            return;
          }
        }

        // hash sensitive data
        const hashedPassword = SHA256(password).toString();
        const hashedPhoneNumber = SHA256(phoneNumber).toString();
        const hashedFullName = SHA256(fullName).toString();

        const userData = {
          fullNameHash: hashedFullName,
          email,
          phoneNumberHash: hashedPhoneNumber,
          password: hashedPassword,
        };

        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        alert('Signup data saved locally!');
        // Optional: clear form or navigate
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setPasswordVisible(false);
        setConfirmPasswordVisible(false);
      } catch (error) {
        console.error('Failed to save user data', error);
        alert('Failed to save user data.');
      }
    };

    const handleSignInRedirect = () => {
      // Navigate to the SignUp page
      navigation.navigate('Signin');
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
                    <ImageBackground
                        source={require('../images/bg-1.jpeg')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    >
                        
                        <TypingText text={["Let's", "Start!"]}/>
                    </ImageBackground>
                </View>
                <View style={styles.formContainer}>
        <Text style={styles.label}>Sign up</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#aaa"
          maxLength={50}
        />

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
          keyboardType='phone-pad'
          maxLength={13}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          placeholderTextColor="#aaa"
          maxLength={50}
        />

        <View style={styles.passwordInput}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
            secureTextEntry= {!passwordVisible}
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
        
        <View style={styles.passwordInput}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#aaa"
            secureTextEntry = {!confirmPasswordVisible}
            maxLength={20}
          />

          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Icon
              name={confirmPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignup}>
          <Icon name="arrow-right" size={32} color="#fff"/>
        </TouchableOpacity>

        <View style={styles.links}>
          <Text style={styles.forgotText}>Already have an account?</Text>

          <TouchableOpacity onPress={handleSignInRedirect}>
            <Text style={styles.linkText}>Sign in</Text>
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
    paddingTop: 170,
  },
    formContainer: {
        flex: 2,
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
        fontSize: 16
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
        marginTop: 40,
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

export default Signup;