import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Button, Text } from 'native-base';
import {
  StackActions,
  NavigationScreenProp,
  NavigationActions,
} from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<{}>;
}

const Login: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <Button
      rounded
      style={{ justifyContent: 'center', marginTop: -150, width: 80 }}
      onPress={() =>
        navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          })
        )
      }
    >
      <Text>Hi</Text>
    </Button>
  </View>
);

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
