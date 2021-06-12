import React from 'react';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppLoading } from 'expo';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import { AppActionsProvider, AuthProvider, Auth } from './src/common/context';
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
    const unsubscribeFromFirebaseAuth = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userId = user.uid;
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims['https://hasura.io/jwt/claims']) {
          const token = tokenResult.token;
          setClient(createGraphqlClient(token));
          setAuth({
            token,
            userId,
          });
          setFirebaseInitialized(true);
        } else {
          let retries = 0;
          const retryTokenRetrieval = () => {
            return new Promise<void>((resolve) => {
              setTimeout(async () => {
                if (retries === 0) {
                  retries =+ 1;
                  resolve();
                } else if (retries >= 0 && retries < 6) {
                  retries += 1;
                  const tokenResult = await firebase.auth().currentUser.getIdTokenResult(true);
                  if (tokenResult.claims['https://hasura.io/jwt/claims']) {
                    console.log('whoa 3');
                    const token = tokenResult.token;
                    setClient(createGraphqlClient(token));
                    setAuth({
                      token,
                      userId,
                    });
                    setFirebaseInitialized(true);
                    retries = -1;
                    resolve();
                  }
                } else {
                  resolve();
                }
              }, 100)
            });
          }

          while (retries >= 0 && retries < 6) {
            console.log('retrying at ' + retries);
            await retryTokenRetrieval();
          }
        }
      } else {
        setAuth({
          token: null,
          userId: null,
        });
        setClient(null);
        setFirebaseInitialized(true);
      }
    });
    return () => {
      unsubscribeFromFirebaseAuth();
    };
  }, []);

  if (!fontsLoaded || authButNoClient || !firebaseInitialized) {
    return <AppLoading />;
  }

  if (noAuthNoClient) {
    return <NavContainer />;
  }

  return (
    <AppActionsProvider>
      <AuthProvider value={auth}>
        <ApolloProvider client={client}>
          <NavContainer />
        </ApolloProvider>
      </AuthProvider>
    </AppActionsProvider>
  );
};

export default App;
