import React from 'react';
import { StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <>
      <StatusBar hidden={true} />
      <WebView
        source={{uri: "https://www.lostarts.xyz" }}
        style={{ marginTop: 40, marginBottom: 30 }}
      />
    </>
  );
}
