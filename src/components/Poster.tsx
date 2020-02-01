import React from 'react';
import { StyleSheet, KeyboardAvoidingView, ViewStyle } from 'react-native';
import { View, Button, Icon, Text, Item, Input } from 'native-base';
import Animated, { Easing } from 'react-native-reanimated';

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  stopClock,
  block,
} = Animated;

const INPUT_HIDDEN_OFFSET = -500;

const runTiming = (
  clock: Animated.Clock,
  value: number,
  dest: number,
  easing: Animated.EasingFunction
) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 300,
    toValue: new Value(0),
    easing,
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

interface Props {
  handleAdd: () => void;
}

const Poster: React.FC<Props> = ({ handleAdd }) => {
  const [inputVisible, setInputVisible] = React.useState(false);

  const textInput = React.useRef(null);

  React.useEffect(() => {
    if (inputVisible && textInput.current && textInput.current._root) {
      textInput.current._root.focus();
    }
  }, [inputVisible]);

  const transX: Animated.Node<number> = runTiming(
    new Clock(),
    -500,
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
                    ? { translateX: transX }
                    : { translateY: transY },
                ],
              },
            ] as ViewStyle
          }
        >
          <Item style={styles.inputGroup}>
            <Input
              style={styles.textInput}
              placeholder="Todo"
              returnKeyType="send"
              keyboardAppearance="dark"
              onBlur={toggleInput}
              ref={textInput}
            />
          </Item>
          <Button style={styles.addBtn}>
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
