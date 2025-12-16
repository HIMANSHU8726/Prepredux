import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { useState,useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

export default function login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '12842534528-mis1kd2v6shai2ifmg05dc46p0p2tqp2.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      if (userInfo) {
        props.navigation.navigate('Dashboard');
      }

      // If you need the ID token to send to your backend:
      const { idToken } = await GoogleSignin.getTokens();
      console.log('ID Token:', idToken);

      Alert.alert('Success', `Welcome ${userInfo.user.name}`);
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
            console.log('Error:', error.message);
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log('Error:', error);
      }
    }
  };

  const handleLogin = () => {
    console.log(email, password);
  };

  const handleRegister = async () => {
    const body = {
      email: 'usera01@yopmail.com',
      password: 'Test@123',
      device_type: 'ios,android',
      device_id:
        'iuytyuilig:APA91bFjKDq5ytXgl_bPc0oI0jwdbnutDqFr5_TKoUBdqcA0nwQl5N96fSKVryLJBMEiiD0_OpnAUm5Vi4nqbMgbrvumL1HHTfF-r2uM6DSzP2w5eRtABnAuIzTrzC1vAw2napDgEQ5M',
      fcm_id: 'iuytyuiligkjkhjj-r2uM6DSzP2w5eRtABnAuIzTrzC1vAw2napDgEQ5M',
    };

    const response = await fetch('https://demo4.1hour.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const cookieHeader = response.headers.get('Set-Cookie');
    console.log('Set-Cookie Header:', cookieHeader);
    let cookie = null;
    if (cookieHeader) {
      // Simple extraction: take everything before the first semicolon
      cookie = cookieHeader.split(';')[0];
    }

    const json = await response.json();
    console.log('Login Response:', json);
    if (json.token || (json.data && json.data.token)) {
      const token = json.token || json.data.token;
      dispatch(
        setCredentials({
          user: json.user || json.data.user,
          token: token,
          cookie: cookie,
        }),
      );
      props.navigation.navigate('Dashboard');
    } else {
      console.log(json.error || 'Login failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: 'black',
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Login" onPress={handleRegister} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Google Sign-In" onPress={signIn} />
      </View>
    </View>
  );
}
