import React, { useEffect, useState } from 'react';
import { StatusBar, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_URI = 'https://www.lostarts.xyz';

export default function App() {
  const [uri, setUri] = useState(DEFAULT_URI);

  useEffect(() => {
    Linking.getInitialURL().then(handleUriChange);
    Linking.addEventListener('url', ({ url }) => handleUriChange(url));
  }, []);

  function handleUriChange(val: string) {
    val.startsWith(DEFAULT_URI) && setUri(val);
  }

  return (
    <>
      <StatusBar hidden={true} />
      <WebView
        source={{ uri }}
        style={{ marginTop: 40, marginBottom: 30 }}
      />
    </>
  );
}
