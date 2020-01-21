import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button, Icon } from 'native-base';

interface Props {
  handleAdd: () => void;
}

class Poster extends React.Component<Props> {
  render() {
    const { handleAdd } = this.props;
    return (
      <View style={styles.container} pointerEvents="box-none">
        <Text style={styles.text}>YO</Text>
        <Button rounded style={styles.button} onPress={() => handleAdd()}>
          <Icon name="flame" />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    width: 50,
    height: 50,
    position: 'relative',
    bottom: 50,
    right: 50,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 3,
  },
  text: {
    position: 'relative',
    bottom: 80,
    right: 20,
    width: '75%',
    height: 80,
    borderWidth: 1,
  },
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default Poster;
