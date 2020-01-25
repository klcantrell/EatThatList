import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TextInput as ReactNativeTextInput,
} from 'react-native';
import {
  View,
  Button,
  Icon,
  Text,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';

interface Props {
  handleAdd: () => void;
}

const Poster: FunctionComponent<Props> = ({ handleAdd }) => {
  const [inputVisible, setInputVisible] = React.useState(false);

  const textInput = React.useRef<ReactNativeTextInput>(null);

  React.useEffect(() => {
    if (inputVisible && textInput.current) {
      textInput.current.focus();
    }
  }, [inputVisible]);

  const toggleInput = () => setInputVisible(!inputVisible);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="position"
        keyboardVerticalOffset={-70}
        pointerEvents="box-none"
      >
        {inputVisible && (
          <Form style={styles.form}>
            <Item style={styles.inputGroup} floatingLabel>
              <Label style={styles.label}>Todo</Label>
              <Input
                style={styles.textInput}
                returnKeyType="send"
                keyboardAppearance="dark"
                onBlur={toggleInput}
                getRef={(c: any) => (textInput.current = c._root)}
              />
            </Item>
            <Button style={styles.addBtn} rounded>
              <Text>Sup</Text>
            </Button>
          </Form>
        )}
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
    bottom: 70,
    marginHorizontal: 1,
    backgroundColor: '#444',
    flexDirection: 'row',
    borderRadius: 28,
  },
  inputGroup: {
    flexGrow: 1,
    marginBottom: 3,
    marginLeft: 30,
    height: 40,
  },
  textInput: {
    color: 'white',
  },
  label: {
    marginTop: -15,
    color: 'grey',
  },
  addBtn: {
    height: '100%',
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
