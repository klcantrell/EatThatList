import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Fab from './Fab';
import KeyboardInput from './KeyboardInput';
import ListCard from './ListCard';
import { AppActionsContext } from '../common/context';

interface Props {
  navigation: NavigationStackProp;
}

const GET_LISTS = gql`
  query($userId: String!) {
    Lists(where: { _or: [{ owner: { _eq: $userId } }] }) {
      name
    }
  }
`;

const AvailableLists: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const [showKeyboard, setShowKeyboard] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState('');

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };
  const toggleShowDialog = () => setShowKeyboard(!showKeyboard);

  const { loading, data, error } = useQuery(GET_LISTS, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'no-cache',
  });

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
      <TouchableWithoutFeedback
        onPress={() => {
          setShowKeyboard(false);
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            {error ? (
              <Text>{error.message}</Text>
            ) : loading ? (
              <Text>Loading...</Text>
            ) : (
              data.Lists.map(list => <ListCard name={list.name} />)
            )}
          </View>
          <KeyboardInput
            placeholder="List"
            value={inputValue}
            visible={showKeyboard}
            onChange={setInputValue}
            onBlur={() => setInputValue('')}
          />
          <Fab
            color="red"
            icon="add"
            onPress={toggleShowDialog}
            style={styles.fabBtn}
          />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dialog: {
    position: 'absolute',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
});

export default AvailableLists;
