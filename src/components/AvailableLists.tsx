import React from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
  Button,
  Header,
  Left,
  Right,
  Body,
  Title,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { AppActionsContext } from '../common/context';

interface Props {
  navigation: NavigationStackProp;
}

const AvailableLists: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };

  return (
    <>
      <Header>
        <Left />
        <Body>
          <Title>Your lists</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text>Logout</Text>
          </Button>
        </Right>
      </Header>
      <View style={styles.container}>
        <Text>Hello!</Text>
        <Button
          rounded
          onPress={() => {
            navigation.push('SelectedList');
          }}
        >
          <Text>Go to list</Text>
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    alignItems: 'center',
  },
});

export default AvailableLists;
