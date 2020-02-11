import React from 'react';
import { StyleSheet } from 'react-native';
import {
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
import { StackActions, NavigationActions } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import listService from '../services/api';
import Posts from './Posts';
import Poster from './Poster';
import { usePrevious } from '../common/hooks';
import { AppActionsContext } from '../common/context';

enum LoadingState {
  Idle,
  Loading,
}

interface Props {
  navigation: NavigationStackProp;
}

const SelectedList: React.FC<Props> = ({ navigation }) => {
  const { handleSignout } = React.useContext(AppActionsContext);
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

  const onSignout = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  };

  const handleAdd = async (itemToAdd: number) => {
    const nextItem = list.length ? list[list.length - 1] + 1 : 1;
    const item = await listService.addItem(nextItem);
    setList([...list, item]);
  };

  const handleRemove = async (itemToRemove: number) => {
    setList(list.filter(item => item !== itemToRemove));
    await listService.deleteItem(itemToRemove).catch(() => {
      setList(list);
    });
  };

  return (
    <>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Text>{'Your lists'}</Text>
          </Button>
        </Left>
        <Body>
          <Title>List</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => handleSignout(onSignout)}>
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
    </>
  );
};

const styles = StyleSheet.create({
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

export default SelectedList;
