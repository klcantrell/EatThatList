import React from 'react';
import { Card, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
  itemCount: number;
  onPress: () => void;
}

const ListCard: React.FC<Props> = ({ name, onPress, itemCount }) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <Text style={styles.metadata}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 175,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 26,
  },
  titleContainer: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 2,
    width: '40%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  metadata: {
    marginTop: 5,
    color: 'grey',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListCard;
