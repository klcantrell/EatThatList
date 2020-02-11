import React from 'react';
import { Alert } from 'react-native';
import firebase from 'firebase/app';

const AppActionsContext = React.createContext({
  handleSignout: async (navAction: () => void) => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        navAction();
      })
      .catch(() => {
        Alert.alert('Something went wrong signing you out. Please try again');
      });
  },
});

export { AppActionsContext };
