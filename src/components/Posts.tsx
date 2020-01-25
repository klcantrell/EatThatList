import React, { FunctionComponent } from 'react';
import { FlatList } from 'react-native';
import { ListItem, Text } from 'native-base';

interface Props {
  list: Array<number>;
  innerRef: React.Ref<FlatList<number>>;
}

const Posts: FunctionComponent<Props> = ({ list, innerRef }) => {
  return (
    <FlatList
      ref={innerRef}
      data={[...list].reverse()}
      renderItem={({ item }) => (
        <ListItem>
          <Text>{item}</Text>
        </ListItem>
      )}
      keyExtractor={item => String(item)}
      inverted
    />
  );
};

export default React.forwardRef<FlatList<number>, Props>((props, ref) => (
  <Posts innerRef={ref} {...props} />
));
