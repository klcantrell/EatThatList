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

interface Auth {
  token: string | null;
  userId: string | null;
}

interface AuthProviderProps {
  value: Auth;
}

const AuthContext = React.createContext<Auth>({ token: null, userId: null });

const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
  value,
}) => <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

export { AppActionsContext, AuthContext, AuthContextProvider, Auth };
