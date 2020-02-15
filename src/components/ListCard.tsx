import React from 'react';
import { Card, Text } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
}

const ListCard: React.FC<Props> = ({ name }) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.touchable}>
        <Text>{name}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginLeft: 5,
    height: 100,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListCard;
