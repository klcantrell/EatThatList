import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Spinner } from 'native-base';
import * as listService from '../services/api';
import Posts from './Posts';
import Poster from './Poster';
import { usePrevious } from '../utils/hooks';

enum LoadingState {
  Idle,
  Loading,
}

const Main: React.FC = () => {
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
    if (list.length > previousListCount) {
      setItemAdded(true);
    } else if (list.length < previousListCount) {
      setItemAdded(false);
    }
  }, [list, previousListCount]);

  const handleAdd = async itemToAdd => {
    const item = await listService.addItem(list[list.length - 1] + 1);
    setList([...list, item]);
  };

  const handleRemove = async itemToRemove => {
    setList(list.filter(item => item !== itemToRemove));
  };

  return (
    <Container style={styles.container}>
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
    </Container>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 100,
  },
});
