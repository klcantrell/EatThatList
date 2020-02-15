import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppLoading } from 'expo';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { setupFirebase } from './src/firebase';
import firebase from 'firebase/app';
import { createGraphqlClient } from './src/apollo';
import NavContainer from './src/NavContainer';

setupFirebase();

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState<boolean>(false);
  const [client, setClient] = React.useState(null);

  React.useEffect(() => {
    const loadFonts = async () => {
      await loadFontAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
    };
    loadFonts();
    setFontsLoaded(true);
    return firebase.auth().onAuthStateChanged(async user => {
      const token = await user.getIdToken();
      setClient(createGraphqlClient(token));
    });
  }, []);

  if (!fontsLoaded || !client) {
    return <AppLoading />;
  }

  return (
    <ApolloProvider client={client}>
      <NavContainer />
    </ApolloProvider>
  );
};

export default App;
