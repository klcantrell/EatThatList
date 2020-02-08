import React from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { View, Button, Text, Input, Item } from 'native-base';
import {
  StackActions,
  NavigationScreenProp,
  NavigationActions,
} from 'react-navigation';
import firebase from 'firebase/app';

interface Props {
  navigation: NavigationScreenProp<{}>;
}

const Login: React.FC<Props> = ({ navigation }) => {
  const usernameInput = React.useRef(null);
  const passwordInput = React.useRef(null);
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [creatingAccount, setCreatingAccount] = React.useState<boolean>(false);

  const reset = () => {
    if (usernameInput.current && usernameInput.current._root) {
      usernameInput.current._root.blur();
    }
    if (passwordInput.current && passwordInput.current._root) {
      passwordInput.current._root.blur();
    }
    setCreatingAccount(false);
    setUsername('');
    setPassword('');
  };

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        reset();
        Alert.alert('You are signed in!');
      }
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Item style={styles.loginInput}>
            <Input
              placeholder="username"
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
              rounded
              style={[styles.loginActionsButton, styles.signInButton]}
              onPress={() => {
                // navigation.dispatch(
                //   StackActions.reset({
                //     index: 0,
                //     actions: [
                //       NavigationActions.navigate({ routeName: 'Main' }),
                //     ],
                //   })
                // );
              }}
            >
              <Text>Sign in</Text>
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
                <Text>Create an account</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    top: -100,
  },
  loginInput: {
    backgroundColor: 'white',
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
  },
  createAccountButton: {
    backgroundColor: 'deeppink',
    minWidth: 170,
  },
});
