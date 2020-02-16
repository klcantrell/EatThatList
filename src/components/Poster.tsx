import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import Fab from './Fab';
import KeyboardInput from './KeyboardInput';

interface Props {
  handleAdd: (item: string) => void;
}

const Poster: React.FC<Props> = ({ handleAdd }) => {
  const [showKeyboard, setShowKeyboard] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const toggleInput = () => setShowKeyboard(!showKeyboard);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <KeyboardInput
        placeholder="Todo"
        value={inputValue}
        visible={showKeyboard}
        onChange={setInputValue}
        onBlur={toggleInput}
        onAdd={() => {
          handleAdd(inputValue);
          setInputValue('');
        }}
        onReturn={() => setInputValue('')}
      />
      <Fab
        color="red"
        icon="flame"
        onPress={toggleInput}
        style={styles.fabBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  fabBtn: {
    position: 'relative',
    bottom: 50,
    right: 50,
    justifyContent: 'center',
  },
});

export default Poster;
