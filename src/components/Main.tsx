import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import * as listService from '../services/api';
import Posts from './Posts';
import Poster from './Poster';

enum LoadingState {
  Idle,
  Loading,
}

const Main: React.FC = () => {
  const listRef = React.createRef<FlatList<number>>();
  const [list, setList] = React.useState([]);
  const [loadingState, setLoadingState] = React.useState(LoadingState.Idle);

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
    if (list.length && listRef.current) {
      listRef.current.scrollToIndex({ index: 0 });
    }
  }, [list]);

  const handleAdd = async itemToAdd => {
    const item = await listService.addItem(list[list.length - 1] + 1);
    setList([...list, item]);
  };

  return (
    <Container style={styles.container}>
      {loadingState === LoadingState.Loading ? (
        <Spinner color="pink" style={styles.spinner} />
      ) : (
        <>
          <Posts list={list} innerRef={listRef} />
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
