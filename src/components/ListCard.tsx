import React from 'react';
import { Card, Text } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
  onPress: () => void;
}

const ListCard: React.FC<Props> = ({ name, onPress }) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <Text>{name}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    marginLeft: 10,
    marginRight: 10,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListCard;
