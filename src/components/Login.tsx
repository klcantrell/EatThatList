import React from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { View, Button, Text, Input, Item } from 'native-base';
import {
  StackActions,
  NavigationScreenProp,
  NavigationActions,
} from 'react-navigation';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import firebase from 'firebase/app';
import { AuthContext } from '../common/context';
import Logo from './Logo';

interface FixedLinearGradientProps extends LinearGradientProps {
  children?: React.ReactNode
}

const FixedLinearGradient: React.FC<FixedLinearGradientProps> = LinearGradient;

interface Props {
  navigation: NavigationScreenProp<{}>;
}

const Login: React.FC<Props> = ({ navigation }) => {
  const auth = React.useContext(AuthContext);
  const [creatingAccount, setCreatingAccount] = React.useState<boolean>(false);
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const usernameInput = React.useRef(null);
  const passwordInput = React.useRef(null);

  const reset = () => {
    if (usernameInput.current && usernameInput.current._root) {
      usernameInput.current._root.blur();
    }
    if (passwordInput.current && passwordInput.current._root) {
      passwordInput.current._root.blur();
    }
    setCreatingAccount(false);
    setLoggingIn(false);
    setUsername('');
    setPassword('');
  };

  React.useEffect(() => {
    if (auth?.token !== null) {
      reset();
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        })
      );
    }
  }, [auth]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FixedLinearGradient
          colors={['#CE6D8B', '#d47d99', '#d98ca6', '#da90a9', '#df9fb4']}
          style={styles.linearGradient}
        >
          <View style={styles.logo}>
            <Logo color="#fff" />
            <Text style={styles.logoText}>at That List</Text>
          </View>
          <View style={styles.content}>
            <Item style={styles.loginInput}>
              <Input
                placeholder="email"
                keyboardAppearance="dark"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCompleteType="off"
                ref={usernameInput}
              />
            </Item>
            <Item style={styles.loginInput}>
              <Input
                placeholder="password"
                keyboardAppearance="dark"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCompleteType="off"
                ref={passwordInput}
              />
            </Item>
            <View style={styles.loginActions}>
              <Button
                style={[styles.loginActionsButton, styles.signInButton]}
                onPress={() => {
                  setLoggingIn(true);
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(username, password)
                    .catch(err => {
                      reset();
                      Alert.alert(JSON.stringify(err, null, 2));
                    });
                }}
              >
                {loggingIn ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={{ fontSize: 20 }}>Sign in</Text>
                )}
              </Button>
              <Button
                rounded
                style={[styles.loginActionsButton, styles.createAccountButton]}
                onPress={() => {
                  setCreatingAccount(true);
                  firebase
                    .auth()
                    .createUserWithEmailAndPassword(username, password)
                    .catch(err => {
                      reset();
                      Alert.alert(JSON.stringify(err, null, 2));
                    });
                }}
              >
                {creatingAccount ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={{ fontSize: 18 }}>Create an account</Text>
                )}
              </Button>
            </View>
          </View>
        </FixedLinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    flexDirection: 'row',
    position: 'absolute',
    top: 100,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 25,
    fontWeight: '900',
  },
  content: {
    position: 'relative',
    top: -100,
  },
  loginInput: {
    backgroundColor: '#eee',
    borderWidth: 2,
    width: '85%',
    marginBottom: 20,
  },
  loginActions: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loginActionsButton: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  signInButton: {
    minWidth: 100,
    backgroundColor: 'transparent',
  },
  createAccountButton: {
    backgroundColor: '#4056F4',
    minWidth: 170,
  },
  spinner: {
    marginTop: 50,
  },
});
