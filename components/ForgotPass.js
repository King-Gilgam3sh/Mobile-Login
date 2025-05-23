import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SHA256 from 'crypto-js/sha256';
import Icon from 'react-native-vector-icons/Feather';

const ForgotPass = ({navigation}) => {
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleResetPassword = async () => {
        const hashedPhoneNumber = SHA256(phoneNumber).toString();
        const hashedNewPassword = SHA256(newPassword).toString();

        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }else if(newPassword !== confirmNewPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);

                if (parsedUserData.phoneNumberHash === hashedPhoneNumber) {
                    parsedUserData.password = hashedNewPassword;
                    await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
                    alert('Password reset successful!');
                    navigation.navigate('Signin');
                } else {
                    alert('Invalid phone number.');
                }
            } else {
                alert('No user data found. Please sign up first.');
            }
        } catch (error) {
            console.error('Failed to retrieve user data:', error);
            alert('An error occurred while resetting the password.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageBackground
                    source={require('../images/bg-1.jpeg')}
                    style={styles.image}
                >
                </ImageBackground>
            </View>
            <View style={styles.footer}>
                <TextInput
                    placeholder="Phone Number"
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
                    style={styles.textInput}
                    keyboardType="phone-pad"
                    maxLength={13}
                />
                <View style={styles.passwordInput}>
                    <TextInput
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry = {!newPasswordVisible}
                        maxLength={20}
                    />
                    <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                                <Icon
                                  name={newPasswordVisible ? 'eye' : 'eye-off'}
                                  size={24}
                                  color="gray"
                                />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.passwordInput}>
                    <TextInput
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        secureTextEntry= {!confirmNewPasswordVisible}
                        maxLength={20}
                    />
                    <TouchableOpacity onPress={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)}>
                                <Icon
                                  name={confirmNewPasswordVisible ? 'eye' : 'eye-off'}
                                  size={24}
                                  color="gray"
                                />
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    footer: {
        flex: 2,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    textInput: {
        height: 50,
        borderColor: '#898989',
        borderBottomWidth: 1,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    passwordInput: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#898989',
        borderBottomWidth: 1,
        marginBottom: 15,
      }
});

export default ForgotPass;
