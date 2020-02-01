import React from 'react';
import { FlatList } from 'react-native';
import { ListItem, Text } from 'native-base';
import SwipeableRow from './SwipeableRow';

interface Props {
  list: Array<number>;
  innerRef: React.Ref<FlatList<number>>;
}

const Posts: React.FC<Props> = ({ list, innerRef }) => {
  return (
    <FlatList
      ref={innerRef}
      data={[...list].reverse()}
      renderItem={({ item }) => (
        <SwipeableRow actionText="BYEEEE">
          <ListItem>
            <Text>{item}</Text>
          </ListItem>
        </SwipeableRow>
      )}
      keyExtractor={item => String(item)}
      inverted
    />
  );
};

export default React.forwardRef<FlatList<number>, Props>((props, ref) => (
  <Posts innerRef={ref} {...props} />
));
