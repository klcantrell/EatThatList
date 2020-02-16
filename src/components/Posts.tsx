import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ListItem, Text } from 'native-base';
import SwipeableRow from './SwipeableRow';

type Item = {
  id: number;
  description: string;
};

interface Props {
  list: Item[];
  scrollToEnd: boolean;
  handleRemove: (num: number) => void;
}

const Posts: React.FC<Props> = ({ list, scrollToEnd, handleRemove }) => {
  const self = React.createRef<FlatList<Item>>();

  return (
    <FlatList
      style={styles.list}
      ref={self}
      data={list}
      renderItem={({ item }) => (
        <SwipeableRow
          actionText="BYEEEE"
          handleRemove={() => handleRemove(item.id)}
          id={item.id}
        >
          <ListItem>
            <Text>{item.description}</Text>
          </ListItem>
        </SwipeableRow>
      )}
      keyExtractor={item => String(item.id)}
      initialNumToRender={16}
      onContentSizeChange={() => {
        if (scrollToEnd) {
          self.current.scrollToEnd();
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    marginBottom: 80,
  },
});

export default Posts;
