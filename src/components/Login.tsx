import React from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
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
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Item style={styles.loginInput}>
            <Input
              placeholder="username"
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCompleteType="off"
            />
          </Item>
          <Item style={styles.loginInput}>
            <Input
              placeholder="password"
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCompleteType="off"
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
                firebase
                  .auth()
                  .createUserWithEmailAndPassword(username, password)
                  .then(() => {
                    setUsername('');
                    setPassword('');
                  })
                  .catch(err => Alert.alert(JSON.stringify(err, null, 2)));
              }}
            >
              <Text>Create an account</Text>
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
    width: 100,
  },
  createAccountButton: {
    backgroundColor: 'deeppink',
  },
});
