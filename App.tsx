import React, { useState, useEffect } from 'react'; // <--- Fixed: Added useEffect
import { Button, Text, View, FlatList, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

function App() {
  // <--- Fixed: Initialized as empty array [] instead of string ''
  const [employeeName, setEmployeeName] = useState([]);

  // 1. Request Permission
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken(); // <--- Fixed: Removed 'NotificationService.'
    }
  };

  // 2. Get FCM Token
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      Alert.alert('FCM Token Generated', token); // Added Alert so you can see it easily
    } catch (error) {
      console.log('Error getting token:', error);
    }
  };

  // 3. Listener Setup
  useEffect(() => {
    requestUserPermission();

    // A. FOREGROUND LISTENER
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      Alert.alert('Foreground Message Received', JSON.stringify(remoteMessage)); // <--- Added Alert

      try {
        // Request permissions explicitly for Notifee (Android 13+)
        await notifee.requestPermission();

        // Create Channel (Android) - NEW ID to reset settings
        const channelId = await notifee.createChannel({
          id: 'high_importance_channel',
          name: 'High Importance Channel',
          importance: AndroidImportance.HIGH,
        });

        console.log('Channel Created:', channelId);

        // Display Notification
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId,
            importance: AndroidImportance.HIGH, // Redundant but good for sanity
            pressAction: {
              id: 'default',
            },
          },
        });
      } catch (error) {
        Alert.alert('Notifee Error', error.toString());
        console.error('Notifee Error:', error);
      }
    });

    // B. BACKGROUND EVENT (App opened from background)
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background:', remoteMessage);
    });

    // C. QUIT STATE EVENT (App opened from killed state)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state:', remoteMessage);
        }
      });

    // CLEANUP FUNCTION (Interview Best Practice)
    // When the component unmounts, stop listening to avoid memory leaks.
    return () => unsubscribe();
  }, []);

  const apiCall = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/users');
      const data = await response.json();
      console.log(data, 'data');
      setEmployeeName(data);
    } catch (error) {
      console.error(error);
    }
  };

  const flatelistItem = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: '#f0f0f0', // Changed color to be easier on eyes
          padding: 15,
          marginVertical: 8,
          marginHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'black', fontWeight: 'bold' }}>
          {item.name?.firstname} {item.name?.lastname}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <View style={{ height: 100, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Dashboard</Text>
        <Button title="Get Users" onPress={apiCall} />
      </View>

      <FlatList
        data={employeeName}
        renderItem={flatelistItem}
        keyExtractor={item => item.id.toString()} // Best practice: Always add keyExtractor
      />
    </View>
  );
}

export default App;
