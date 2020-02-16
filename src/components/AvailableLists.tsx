import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
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
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Fab from './Fab';
import KeyboardInput from './KeyboardInput';
import ListCard from './ListCard';
import { AppActionsContext, AuthContext } from '../common/context';

interface Props {
  navigation: NavigationStackProp;
}

const GET_LISTS = gql`
  query($userId: String!) {
    Lists(where: { _or: [{ owner: { _eq: $userId } }] }) {
      id
      name
    }
  }
`;
const ADD_LIST = gql`
  mutation($name: String!, $userId: String!) {
    insert_Lists(objects: [{ name: $name, owner: $userId }]) {
      returning {
        id
        name
        owner
      }
    }
  }
`;

const AvailableLists: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
  const [showKeyboard, setShowKeyboard] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState('');
  const auth = React.useContext(AuthContext);

  const {
    loading: getListLoading,
    data: getListData,
    error: getListError,
  } = useQuery(GET_LISTS, {
    variables: {
      userId: auth.userId,
    },
  });
  const [
    addList,
    { data: addListData, loading: addListLoading, error: addListError },
  ] = useMutation(ADD_LIST);
  const onAddList = () => {
    addList({
      variables: {
        name: inputValue,
        userId: auth.userId,
      },
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_Lists: {
          __typename: 'Lists_mutation_response',
          returning: [
            {
              __typename: 'Lists',
              owner: auth.userId,
              name: inputValue,
              id: Math.random() * -10000 + Number(auth.userId),
            },
          ],
        },
      },
      update: (
        proxy,
        {
          data: {
            insert_Lists: { returning },
          },
        }
      ) => {
        const { Lists } = proxy.readQuery({
          query: GET_LISTS,
          variables: {
            userId: auth.userId,
          },
        });
        proxy.writeQuery({
          query: GET_LISTS,
          variables: {
            userId: auth.userId,
          },
          data: { Lists: [...Lists, ...returning] },
        });
      },
    });
  };

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };
  const toggleShowDialog = () => setShowKeyboard(!showKeyboard);
  const hideKeyboardAndClear = () => {
    setShowKeyboard(false);
    setInputValue('');
  };
  const onSelectList = (listId: number) => {
    navigation.navigate({
      routeName: 'SelectedList',
      params: {
        listId,
      },
    });
  };

  if (getListError) {
    Alert.alert('Something went wrong, please try again');
  }

  if (addListError) {
    Alert.alert('Could not add item, please try again');
  }

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
          hideKeyboardAndClear();
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            {getListLoading ? (
              <Text>Loading...</Text>
            ) : (
              getListData.Lists.map(list => (
                <ListCard
                  key={list.id}
                  name={list.name}
                  onPress={() => onSelectList(list.id)}
                />
              ))
            )}
          </View>
          <KeyboardInput
            placeholder="List"
            value={inputValue}
            visible={showKeyboard}
            onChange={setInputValue}
            onAdd={onAddList}
            onReturn={hideKeyboardAndClear}
            onBlur={hideKeyboardAndClear}
          />
          <Fab
            color="red"
            icon="flame"
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
  },
  fabBtn: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
});

export default AvailableLists;
