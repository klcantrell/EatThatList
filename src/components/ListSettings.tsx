import React from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
  Container,
  Header,
  Left,
  Body,
  Button,
  Right,
  Title,
  Icon,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { AppActionsContext } from '../common/context';

interface Props {
  navigation: NavigationStackProp;
}

const ListSettings: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const listId = navigation.getParam('listId');

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.pop()}>
            <Icon name="arrow-back" style={styles.arrowBack} />
            <Text>Your lists</Text>
          </Button>
        </Left>
        <Body>
          <Title>List Settings</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
            <Text>Logout</Text>
          </Button>
        </Right>
      </Header>
      <View>
        <Text>{`Settings for list with ID ${listId}`}</Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  arrowBack: {
    marginRight: 5,
  },
});

export default ListSettings;
