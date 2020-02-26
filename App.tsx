import React from 'react';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppLoading } from 'expo';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import { AuthContextProvider, Auth } from './src/common/context';
import { setupFirebase } from './src/services/firebase';
import { createGraphqlClient } from './src/services/apollo';
import NavContainer from './src/components/NavContainer';

setupFirebase();

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState<boolean>(false);
  const [client, setClient] = React.useState<
    ApolloClient<NormalizedCacheObject>
  >(null);
  const [auth, setAuth] = React.useState<Auth>({ token: null, userId: null });
  const [firebaseInitialized, setFirebaseInitialized] = React.useState<boolean>(
    false
  );

  const authButNoClient = auth?.token && !client;
  const noAuthNoClient = !auth?.token && !client;

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
      if (user) {
        const token = await user.getIdToken();
        const userId = user.uid;
        setClient(createGraphqlClient(token));
        setAuth({
          token,
          userId,
        });
        setFirebaseInitialized(true);
      } else {
        setAuth({
          token: null,
          userId: null,
        });
        setClient(null);
        setFirebaseInitialized(true);
      }
    });
  }, []);

  if (!fontsLoaded || authButNoClient || !firebaseInitialized) {
    return <AppLoading />;
  }

  if (noAuthNoClient) {
    return <NavContainer />;
  }

  return (
    <AuthContextProvider value={auth}>
      <ApolloProvider client={client}>
        <NavContainer />
      </ApolloProvider>
    </AuthContextProvider>
  );
};

export default App;
