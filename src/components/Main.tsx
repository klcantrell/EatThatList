import React from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Title, Body } from 'native-base';
import Posts from './Posts';
import Poster from './Poster';

const Main: React.FC = () => {
  const listRef = React.createRef<FlatList<number>>();
  const [list, setList] = React.useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
  ]);

  React.useEffect(() => {
    listRef.current.scrollToIndex({ index: 0 });
  }, [list]);

  const handleAdd = () => {
    setList([...list, list[list.length - 1] + 1]);
  };

  return (
    <Container>
      <Posts list={list} innerRef={listRef} />
      <Poster handleAdd={handleAdd} />
    </Container>
  );
};

export default Main;
