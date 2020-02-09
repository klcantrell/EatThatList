import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  Container,
  Spinner,
  Header,
  Title,
  Body,
  Right,
  Left,
  Button,
  View,
  Text,
} from 'native-base';
import {
  StackActions,
  NavigationActions,
  NavigationScreenProp,
} from 'react-navigation';
import firebase from 'firebase/app';
import * as listService from '../services/api';
import Posts from './Posts';
import Poster from './Poster';
import { usePrevious } from '../utils/hooks';

enum LoadingState {
  Idle,
  Loading,
}

interface Props {
  navigation: NavigationScreenProp<{}>;
}

const Main: React.FC<Props> = ({ navigation }) => {
  const [list, setList] = React.useState([]);
  const previousListCount = usePrevious(list.length);
  const [loadingState, setLoadingState] = React.useState(LoadingState.Idle);
  const [itemAdded, setItemAdded] = React.useState(false);

  React.useEffect(() => {
    const getList = async () => {
      setLoadingState(LoadingState.Loading);
      const listData = await listService.fetchList();
      setList(listData);
      setLoadingState(LoadingState.Idle);
    };
    getList();
  }, []);

  React.useEffect(() => {
    if (list.length > previousListCount && previousListCount > 0) {
      setItemAdded(true);
    } else if (list.length < previousListCount) {
      setItemAdded(false);
    }
  }, [list, previousListCount]);

  const handleAdd = async (itemToAdd: number) => {
    const item = await listService.addItem(list[list.length - 1] + 1);
    setList([...list, item]);
  };

  const handleRemove = async (itemToRemove: number) => {
    setList(list.filter(item => item !== itemToRemove));
    await listService.deleteItem(itemToRemove).catch(() => {
      setList(list);
    });
  };

  const handleSignOut = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
          })
        );
      })
      .catch(() => {
        Alert.alert('Something went wrong signing you out. Please try again');
      });
  };

  return (
    <Container style={styles.container}>
      <Header>
        <Left />
        <Body>
          <Title>List</Title>
        </Body>
        <Right>
          <Button transparent onPress={handleSignOut}>
            <Text>Logout</Text>
          </Button>
        </Right>
      </Header>
      <View style={styles.body}>
        {loadingState === LoadingState.Loading ? (
          <Spinner color="pink" style={styles.spinner} />
        ) : (
          <>
            <Posts
              list={list}
              scrollToEnd={itemAdded}
              handleRemove={handleRemove}
            />
            <Poster handleAdd={handleAdd} />
          </>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 100,
  },
  button: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateY: -10 }],
  },
});

export default Main;
