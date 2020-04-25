import React, { useEffect, useState } from 'react';
import { Linking, Platform, StatusBar, Vibration } from 'react-native';
import { WebView } from 'react-native-webview';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const DEFAULT_URI = 'https://www.lostarts.xyz';

export default function App() {
  const [uri, setUri] = useState(DEFAULT_URI);
  const [pushToken, setPushToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Linking.getInitialURL().then(handleUriChange);
    Linking.addEventListener('url', ({ url }) => handleUriChange(url));

    registerForPushNotificationsAsync().then((token) => {
      setPushToken(token);
      setLoading(false);
    });
    Notifications.addListener(handleNotifications);
  }, []);

  function handleUriChange(val: string) {
    val.startsWith(DEFAULT_URI) && setUri(val);
  }

  function handleNotifications(notification) {
    if(notification.origin === 'received') {
      Vibration.vibrate(500);
    }

    if (notification.origin === 'selected') {
      setUri(notification.data.uri);
    }
  }

  async function registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      return Notifications.getExpoPushTokenAsync();
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  // TODO: A proper loading indicator
  if (loading) {
    return <></>;
  }

  return (
    <>
      <StatusBar hidden={true} />
      <WebView
        source={{
          uri,
          headers: {
            Cookie: `push_token=${pushToken}`
          },
        }}
        sharedCookiesEnabled={true}
        style={{ marginTop: 40, marginBottom: 30 }}
      />
    </>
  );
}
