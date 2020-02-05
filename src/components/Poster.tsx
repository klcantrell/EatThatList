import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ViewStyle,
  Keyboard,
} from 'react-native';
import { View, Button, Icon, Text, Item, Input } from 'native-base';
import Animated, { Easing } from 'react-native-reanimated';
import { runTiming } from '../utils/animations';
import { usePrevious } from '../utils/hooks';

const { Clock } = Animated;

const INPUT_HIDDEN_OFFSET = -500;

interface Props {
  handleAdd: (item: number) => Promise<void>;
}

const Poster: React.FC<Props> = ({ handleAdd }) => {
  const [inputVisible, setInputVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const textInput = React.useRef(null);
  const previousInputVisible = usePrevious(inputVisible);

  const isInitialRenderOfInput = !previousInputVisible && !inputVisible;
  const wasHidden = !previousInputVisible && inputVisible;
  const wasVisible = previousInputVisible && !inputVisible;

  React.useEffect(() => {
    if (wasHidden && textInput.current && textInput.current._root) {
      textInput.current._root.focus();
    }
  }, [inputVisible]);

  const transX: Animated.Node<number> = runTiming(
    new Clock(),
    INPUT_HIDDEN_OFFSET,
    0,
    Easing.inOut(Easing.ease)
  );
  const transY: Animated.Node<number> = runTiming(
    new Clock(),
    0,
    -INPUT_HIDDEN_OFFSET,
    Easing.in(Easing.ease)
  );

  const toggleInput = () => setInputVisible(!inputVisible);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="position"
        pointerEvents="box-none"
        keyboardVerticalOffset={70}
      >
        <Animated.View
          style={
            [
              styles.form,
              {
                transform: [
                  inputVisible
                    ? {
                        translateX: isInitialRenderOfInput
                          ? INPUT_HIDDEN_OFFSET
                          : wasHidden
                          ? transX
                          : 0,
                      }
                    : {
                        translateY: isInitialRenderOfInput
                          ? -INPUT_HIDDEN_OFFSET
                          : wasVisible
                          ? transY
                          : 0,
                      },
                ],
              },
            ] as ViewStyle
          }
        >
          <Item style={styles.inputGroup}>
            <Input
              style={styles.textInput}
              onChangeText={text => setInputValue(text)}
              placeholder="Todo"
              returnKeyType="send"
              keyboardAppearance="dark"
              onBlur={toggleInput}
              value={inputValue}
              ref={textInput}
              onSubmitEditing={() => {
                handleAdd(Number(inputValue));
                setInputValue('');
                Keyboard.dismiss();
              }}
            />
          </Item>
          <Button
            style={styles.addBtn}
            onPress={() => {
              handleAdd(Number(inputValue));
              setInputValue('');
              Keyboard.dismiss();
            }}
          >
            <Text>Sup</Text>
          </Button>
        </Animated.View>
      </KeyboardAvoidingView>
      <Button rounded style={styles.fabBtn} onPress={toggleInput}>
        <Icon name="flame" />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  fabBtn: {
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
  keyboardView: {
    width: '100%',
  },
  form: {
    position: 'relative',
    bottom: 20,
    transform: [{ translateX: INPUT_HIDDEN_OFFSET }],
    marginHorizontal: 1,
    backgroundColor: '#dbdbdb',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 8,
  },
  inputGroup: {
    flexGrow: 1,
    marginRight: 5,
    marginBottom: 3,
    marginLeft: 5,
    height: 40,
  },
  textInput: {
    color: '#111',
  },
  addBtn: {
    height: '90%',
    borderRadius: 8,
    margin: 2,
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
