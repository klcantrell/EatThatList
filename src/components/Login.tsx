import React from 'react';
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
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
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
