import React from 'react';
import { KeyboardAvoidingView, ViewStyle, StyleSheet } from 'react-native';
import { Button, Text, Item, Input } from 'native-base';
import Animated, { Easing } from 'react-native-reanimated';
import { usePrevious } from '../common/hooks';
import { runTiming } from '../common/animations';

const INPUT_HIDDEN_OFFSET = -500;

const { Clock } = Animated;

interface Props {
  placeholder?: string;
  value?: string;
  visible?: boolean;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  onAdd?: () => void;
  onReturn?: () => void;
}

const KeyboardInput: React.FC<Props> = ({
  placeholder = '',
  value = '',
  visible = false,
  onChange = () => {},
  onBlur = () => {},
  onAdd = () => {},
  onReturn = () => {},
}) => {
  const textInput = React.useRef(null);
  const previousInputVisible = usePrevious(visible);
  const isInitialRenderOfInput = !previousInputVisible && !visible;
  const wasHidden = !previousInputVisible && visible;
  const wasVisible = previousInputVisible && !visible;

  const transX: Animated.Node<number> = runTiming(
    300,
    new Clock(),
    INPUT_HIDDEN_OFFSET,
    0,
    Easing.inOut(Easing.ease)
  );
  const transY: Animated.Node<number> = runTiming(
    100,
    new Clock(),
    0,
    -INPUT_HIDDEN_OFFSET,
    Easing.in(Easing.ease)
  );

  React.useEffect(() => {
    if (wasHidden && textInput.current && textInput.current._root) {
      textInput.current._root.focus();
    }
  }, [visible]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior="position"
      pointerEvents={visible ? 'auto' : 'none'}
      keyboardVerticalOffset={87}
    >
      <Animated.View
        style={
          [
            styles.form,
            {
              transform: [
                visible
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
            onChangeText={onChange}
            placeholder={placeholder}
            keyboardAppearance="dark"
            onBlur={onBlur}
            value={value}
            ref={textInput}
            onSubmitEditing={onReturn}
          />
        </Item>
        <Button
          style={styles.addBtn}
          onPress={() => {
            onAdd();
          }}
        >
          <Text>Add</Text>
        </Button>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    width: '100%',
  },
  form: {
    transform: [{ translateX: INPUT_HIDDEN_OFFSET }],
    margin: 1,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 8,
  },
  textInput: {
    color: '#111',
  },
  addBtn: {
    height: '90%',
    borderRadius: 8,
    margin: 2,
    backgroundColor: '#470FF4',
  },
  inputGroup: {
    flexGrow: 1,
    marginRight: 5,
    marginBottom: 3,
    marginLeft: 5,
    height: 40,
  },
});

export default KeyboardInput;
